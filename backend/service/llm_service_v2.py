import vertexai
from vertexai.preview.language_models import TextGenerationModel
from constants import *
from fastapi import UploadFile
from loguru import logger
from google import genai
from google.genai import types
from custom_types.commons import Model

class LLMServiceV2:
    def __init__(self) -> None:
        self.genai_client = genai.Client(
            vertexai=True, project=PROJECT_ID, location=VERTEX_LOCATION
        )
        # We need to initialise the vertexai client to use the medlm model, as it doesnt seem to work with the new genai client
        self.vertexai_client = vertexai.init(
            project=PROJECT_ID, location=VERTEX_LOCATION
        )

    async def v2_get_summary_for_medical_report_and_patient_details(
        self, pdf_file: UploadFile
    ):
        logger.info(f"Generating summary for medical report and patient details")
        file_contents = await pdf_file.read()

        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_PRO_2,
            contents=[
                types.Part.from_text(
                    MEDICAL_REPORT_SUMMARY_PROMPT_V2__SUMMARY_OF_REPORT_AND_PATIENT_DETAILS
                ),
                types.Part.from_bytes(file_contents, "application/pdf"),
            ],
        )
        return response.text

    async def v2_get_summary_for_prescription(self, pdf_file: UploadFile):
        logger.info(f"Generating summary for prescription")
        file_contents = await pdf_file.read()

        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_PRO_2,
            contents=[
                types.Part.from_text(PRESCRIPTION_SUMMARY_PROMPT),
                types.Part.from_bytes(file_contents, "application/pdf"),
            ],
        )
        return response.text

    def v2_get_medlm_summary_for_medical_report(self, summary: str):
        logger.info(f"Generating summary for medical report")
        model = TextGenerationModel.from_pretrained("medlm-large")
        parameters = {
            "candidate_count": 1,
            "max_output_tokens": 1024,
            "temperature": 0.2,
            "top_k": 40,
            "top_p": 1,
        }
        response = model.predict(
            MEDICAL_REPORT_SUMMARY_PROMPT_V2__SUMMARY.format(medical_record=summary),
            **parameters
        )
        return response.text

    async def v2_get_two_line_summary_for_medical_report(
        self, medical_report_summary: str, medlm_summary: str
    ):
        logger.info(f"Generating two line summary for medical report")
        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_FLASH,
            contents=[
                types.Part.from_text(MEDICAL_REPORT_SUMMARY_PROMPT_V2__2_LINES_SUMMARY),
                types.Part.from_text(str(medical_report_summary)),
                types.Part.from_text(str(medlm_summary)),
            ],
        )
        return response.text
    
    async def v2_get_claim_approval_for_medical_report(self, medical_report: str, prescription: str):
        logger.info(f"Generating claim approval for medical report")
        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_PRO_2,
            contents=[
                types.Part.from_text(CLAIM_APPROVAL_MEDICAL_REPORT_PROMPT_V2.format(condition=medical_report, medication=prescription)),
            ],
        )
        return response.text
    
    def v2_get_claim_approval_for_prescription_with_medlm(self, medical_report: str, prescription: str) -> str:
        logger.info(f"Generating claim approval for prescription with medlm")
        model = TextGenerationModel.from_pretrained("medlm-large")
        parameters = {
            "candidate_count": 1,
            "max_output_tokens": 1024,
            "temperature": 0.2,
            "top_k": 40,
            "top_p": 1,
        }
        response = model.predict(
            CLAIM_APPROVAL_PRESCRIPTION_PROMPT_V2.format(condition=medical_report, medication=prescription),
            **parameters
        )
        return response.text
    
    async def v2_get_claim_approval_for_prescription_with_gemini(self, medical_report: str, prescription: str) -> str:
        logger.info(f"Generating claim approval for prescription with gemini")
        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_PRO_2,
            contents=[
                types.Part.from_text(CLAIM_APPROVAL_PRESCRIPTION_PROMPT_V2.format(condition=medical_report, medication=prescription)),
            ],
        )
        return response.text
    
    async def v2_get_claim_outcome(self, summary: str):
        logger.info(f"Generating claim outcome")
        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_FLASH,
            contents=[
                types.Part.from_text(CLAIM_OUTCOME_PROMPT.format(summary=summary)),
            ],
        )
        return response.text
    
    def v2_get_medical_glossary_from_medlm(self, query: str):
        logger.info(f"Generating medical glossary from medlm")
        model = TextGenerationModel.from_pretrained(Model.MEDLM.value)
        parameters = {
            "candidate_count": 1,
            "max_output_tokens": 1024,
            "temperature": 0.2,
            "top_k": 40,
            "top_p": 1,
        }
        response = model.predict(MEDICAL_GLOSSARY_PROMPT.format(query=query), **parameters)
        return response.text
    
    async def v2_get_medical_glossary_from_gemini(self, query: str):
        logger.info(f"Generating medical glossary from gemini")
        response = await self.genai_client.aio.models.generate_content(
            model=Model.GEMINI_PRO_1_5,
            contents=[
                types.Part.from_text(MEDICAL_GLOSSARY_PROMPT.format(query=query)),
            ],
        )
        return response.text
    
llmServiceV2 = LLMServiceV2()
