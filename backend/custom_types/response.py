from pydantic import BaseModel
from typing import Any

class ApiResponse(BaseModel):
    detail: str = None
    data: Any = None

class SummaryApiResponse(BaseModel):
    summary: str = None
    outcome: str = None

class MedicalGlossaryResponse(BaseModel):
    result: str = None