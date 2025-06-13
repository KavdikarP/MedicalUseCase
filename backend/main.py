from fastapi import FastAPI, HTTPException, UploadFile
from loguru import logger
import asyncio
from custom_types.request import ClaimApprovalRequest
from custom_types.response import ApiResponse
from utils.chunking import split_text_with_overlap
from utils.pdf_parsing import (
    convert_pdf_to_bytes,
    extract_tables_as_lists,
    extract_text_from_pdf,
    extract_text_outside_tables,
)
from service.llm_service_v2 import llmServiceV2
from custom_types.response import SummaryApiResponse
from custom_types.request import MedicalGlossaryRequest
from custom_types.response import MedicalGlossaryResponse
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/v1/health")
async def v1_health():
    return ApiResponse(detail="ok")


@app.post("/v3/analyse-medical-report")
async def analyse_medical_report(pdf_file: UploadFile):
    summary = await llmServiceV2.v2_get_summary_for_medical_report_and_patient_details(
        pdf_file
    )
    medlm_summary = llmServiceV2.v2_get_medlm_summary_for_medical_report(summary)
    two_line_summary = await llmServiceV2.v2_get_two_line_summary_for_medical_report(summary, medlm_summary)
    return SummaryApiResponse(
        summary=f"""
**Patient Details and Medical Report Summary**\n
{summary}

**Medical Diagnosis (MedLM):**\n
{medlm_summary}

**Overall Summary:**\n
{two_line_summary}
""".strip()
    )


@app.post("/v2/analyse-medical-report")
async def analyse_medical_report(pdf_file: UploadFile):
    try:
        start_time = time.time()
        pdf_buffer = await convert_pdf_to_bytes(pdf_file)
        pdf_conversion_time = time.time() - start_time
        print(f"PDF Conversion Time: {pdf_conversion_time:.2f} seconds")

        start_time = time.time()
        text, tables = await asyncio.gather(
            extract_text_outside_tables(pdf_buffer), extract_tables_as_lists(pdf_buffer)
        )
        pdf_extraction_time = time.time() - start_time
        print(f"PDF Extraction Time: {pdf_extraction_time:.2f} seconds")

        final_text = "".join(text) + "\n\n" + "\n".join(tables)

        start_time = time.time()
        chunks = split_text_with_overlap(final_text)
        chunking_time = time.time() - start_time
        print(f"Chunking Time: {chunking_time:.2f} seconds")

        medical_report_main_chain = (
            llmServiceV2.v2_generate_chain_for_medical_report_gemini_summary()
        )
        patient_detail_chain = (
            llmServiceV2.v2_generate_chain_for_medical_report_gemini_summary(
                type="patient_detail"
            )
        )
        two_line_summary_chain = (
            llmServiceV2.v2_generate_chain_for_medical_report_gemini_summary(
                type="2-line-summary"
            )
        )
        summary_chain = (
            llmServiceV2.v2_generate_chain_for_medical_report_medlm_summary()
        )
        logger.info(
            f"Chain setup time for medical report summary: {time.time() - start_time:.2f} seconds"
        )

        start_time = time.time()
        output_coroutines = []
        # Specifically handle the first chunk if necessary for patient details
        if chunks:
            patient_details_coroutine = patient_detail_chain.ainvoke(
                {"context": chunks[0]}
            )
            output_coroutines.append(patient_details_coroutine)

        # Prepare coroutines for all chunks (including the first one for consistency)
        chunk_outputs_coroutines = [
            medical_report_main_chain.ainvoke({"context": chunk}) for chunk in chunks
        ]
        output_coroutines.extend(chunk_outputs_coroutines)

        outputs = await asyncio.gather(*output_coroutines)

        # Assuming patient details are in the first output if there were any chunks
        patient_details = outputs[0] if chunks else None
        # Skip the first output for text concatenation if there were any chunks
        text_output = "".join(outputs[1:] if chunks else outputs)
        logger.info(
            f"LLM inference time part 1: {time.time() - start_time:.2f} seconds"
        )

        start_time = time.time()
        report_result = await summary_chain.ainvoke({"context": text_output})
        report_summary = await two_line_summary_chain.ainvoke(
            {"context": report_result}
        )

        logger.info(
            f"LLM inference time part 2: {time.time() - start_time:.2f} seconds"
        )

        return SummaryApiResponse(
            summary=f"""
**Patient Details**\n
{patient_details}

**Report Summary**\n
{report_summary}

**Report Result**\n
{report_result}
""".strip()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary for medical report {pdf_file.filename}, error: {str(e)}",
        )


@app.post("/v1/analyse-medical-report")
async def analyse_medical_report(pdf_file: UploadFile):
    try:
        start_time = time.time()
        pdf_buffer = await convert_pdf_to_bytes(pdf_file)
        pdf_conversion_time = time.time() - start_time
        print(f"PDF Conversion Time: {pdf_conversion_time:.2f} seconds")

        start_time = time.time()
        text, tables = await asyncio.gather(
            extract_text_outside_tables(pdf_buffer), extract_tables_as_lists(pdf_buffer)
        )
        pdf_extraction_time = time.time() - start_time
        print(f"PDF Extraction Time: {pdf_extraction_time:.2f} seconds")

        # text = await extract_text_outside_tables(pdf_buffer)
        # tables = await extract_tables_as_lists(pdf_buffer)
        final_text = "".join(text) + "\n\n" + "\n".join(tables)

        start_time = time.time()
        chunks = split_text_with_overlap(final_text)
        chunking_time = time.time() - start_time
        print(f"Chunking Time: {chunking_time:.2f} seconds")

        start_time = time.time()
        chain = llmServiceV2.generate_chain_for_medical_report_summary()

        text_output = ""
        for chunk in chunks:
            chunk_output = chain.invoke({"context": chunk})
            # print("Interim Output: ", chunk_output)
            text_output += chunk_output

        report_summary = chain.invoke({"context": text_output})
        # print(report_summary)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary for medical report {pdf_file.filename}, error: {str(e)}",
        )

    return SummaryApiResponse(summary=report_summary)


@app.post("/v1/analyse-prescription")
async def ca(pdf_file: UploadFile):
    summary = await llmServiceV2.v2_get_summary_for_prescription(pdf_file)
    return SummaryApiResponse(summary=summary)

@app.post("/v1/claim-approval")
async def get_claim_approval_outcome(req: ClaimApprovalRequest):
    medical_report = req.medical_report
    prescription = req.prescription
    start_time = time.time()
    try:
        medical_report_chain = (
            llmServiceV2.generate_chain_for_claim_approval_for_medical_report()
        )
        prescription_chain = (
            llmServiceV2.generate_chain_for_claim_approval_for_prescription()
        )
        medical_report_coroutine = medical_report_chain.ainvoke(
            {"medication": prescription, "condition": medical_report}
        )
        prescription_coroutine = prescription_chain.ainvoke(
            {"medication": prescription, "condition": medical_report}
        )

        medical_report_result, prescription_result = await asyncio.gather(
            medical_report_coroutine, prescription_coroutine
        )

        combined_result = f"{medical_report_result}\n\n{prescription_result}"

        chain_for_outcome = llmServiceV2.generate_chain_for_claim_outcome()
        outcome = chain_for_outcome.invoke({"summary": combined_result})
        logger.info(f"LLM inference time: {time.time() - start_time:.2f} seconds")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate claim approval outcome, error: {str(e)}",
        )
    return SummaryApiResponse(summary=combined_result, outcome=outcome)


@app.post("/v2/claim-approval")
async def get_claim_approval_outcome(req: ClaimApprovalRequest):
    medical_report = req.medical_report
    prescription = req.prescription
    model = req.model or "medlm" # default to medlm if model is not provided
    summary_for_medical_report = await llmServiceV2.v2_get_claim_approval_for_medical_report(medical_report, prescription)
    summary_for_prescription = None
    
    if model == "medlm":
        summary_for_prescription = llmServiceV2.v2_get_claim_approval_for_prescription_with_medlm(medical_report, prescription)
    elif model == "gemini-1.5-pro":
        summary_for_prescription = await llmServiceV2.v2_get_claim_approval_for_prescription_with_gemini(medical_report, prescription)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid model: {model}",
        )
    combined_summary = f"{summary_for_medical_report}\n\n{summary_for_prescription}"
    outcome = await llmServiceV2.v2_get_claim_outcome(combined_summary)
    return SummaryApiResponse(summary=combined_summary, outcome=outcome)

@app.post("/v1/medical-glossary")
async def get_medical_glossary(req: MedicalGlossaryRequest):
    response = None
    if req.model == "medlm":
        response = llmServiceV2.v2_get_medical_glossary_from_medlm(req.query)
    elif req.model == "gemini-1.5-pro":
        response = await llmServiceV2.v2_get_medical_glossary_from_gemini(req.query)
    return MedicalGlossaryResponse(result=response)