import vertexai
from langchain_core.prompts import PromptTemplate
from langchain_google_vertexai import VertexAI
from constants import *
from typing import Literal
from loguru import logger


class LLMService:
    def __init__(self) -> None:
        vertexai.init(project=PROJECT_ID, location=VERTEX_LOCATION)
        
        # Initialize the models and prompts once
        self.med_report_summary_prompt = {
            "main": PromptTemplate.from_template(MEDICAL_REPORT_SUMMARY_PROMPT_V2__MAIN),
            "patient_detail": PromptTemplate.from_template(MEDICAL_REPORT_SUMMARY_PROMPT_V2__PATIENT_DETAILS),
            "2-line-summary": PromptTemplate.from_template(MEDICAL_REPORT_SUMMARY_PROMPT_V2__2_LINES_SUMMARY),
            "summary": PromptTemplate.from_template(MEDICAL_REPORT_SUMMARY_PROMPT_V2__SUMMARY),
        }
        self.med_report_llm = VertexAI(
            model_name="medlm-large",
            max_output_tokens=1024,
            temperature=0.1,
            top_p=1,
            top_k=40,
        )
        self.prescription_llm = VertexAI(
            model_name="medlm-large",
            max_output_tokens=1024,
            temperature=0.2,
            top_p=1,
            top_k=40,
        )
        self.claim_med_report_llm = VertexAI(
            model_name="gemini-1.5-pro-002",
            max_output_tokens=1024,
            temperature=0.2,
            top_p=1,
            top_k=40,
        )
        self.claim_prescription_llm = VertexAI(
            model_name="medlm-large",
            max_output_tokens=1024,
            temperature=0.2,
            top_p=1,
            top_k=40,
        )
        self.claim_outcome_llm = VertexAI(
            model_name="gemini-1.5-pro-002",
            max_output_tokens=1024,
            temperature=0.2,
            top_p=1,
            top_k=40,
        )

    def v2_generate_chain_for_medical_report_summary(self, type: Literal["main", "patient_detail", "2-line-summary", "summary"] = "main"):
        prompt = self.med_report_summary_prompt.get(type, self.med_report_summary_prompt["main"])
        return prompt | self.med_report_llm

    def generate_chain_for_medical_report_summary(self):
        prompt = PromptTemplate.from_template(MEDICAL_REPORT_SUMMARY_PROMPT)
        return prompt | self.med_report_llm

    def generate_chain_for_prescription_summary(self):
        prompt = PromptTemplate.from_template(PRESCRIPTION_SUMMARY_PROMPT)
        return prompt | self.prescription_llm

    def generate_chain_for_claim_approval_for_medical_report(self):
        prompt = PromptTemplate.from_template(CLAIM_APPROVAL_MEDICAL_REPORT_PROMPT_V2)
        return prompt | self.claim_med_report_llm
    
    def generate_chain_for_claim_approval_for_prescription(self):
        prompt = PromptTemplate.from_template(CLAIM_APPROVAL_PRESCRIPTION_PROMPT_V2)
        return prompt | self.claim_prescription_llm

    def generate_chain_for_claim_outcome(self):
        prompt = PromptTemplate.from_template(CLAIM_OUTCOME_PROMPT)
        return prompt | self.claim_outcome_llm


llmService = LLMService()
