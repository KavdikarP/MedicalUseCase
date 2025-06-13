from pydantic import BaseModel
from typing import Literal, Optional

class ClaimApprovalRequest(BaseModel):
    medical_report: str = None
    prescription: str = None
    model: Optional[Literal["gemini-1.5-pro", "medlm"]] = "medlm"

class MedicalGlossaryRequest(BaseModel):
    query: str = None
    model: Literal["gemini-1.5-pro", "medlm"] = "medlm"