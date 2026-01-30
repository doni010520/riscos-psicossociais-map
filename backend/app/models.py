# ============================================================================
# MODELS: Pydantic Schemas
# ============================================================================

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# ============================================================================
# FORM SUBMISSION MODELS
# ============================================================================

class FormAnswers(BaseModel):
    demandas: List[int] = Field(..., min_length=8, max_length=8)
    controle: List[int] = Field(..., min_length=7, max_length=7)
    relacionamento: List[int] = Field(..., min_length=4, max_length=4)
    cargo: List[int] = Field(..., min_length=4, max_length=4)
    mudanca: List[int] = Field(..., min_length=3, max_length=3)
    apoio_chefia: List[int] = Field(..., min_length=5, max_length=5)
    apoio_colegas: List[int] = Field(..., min_length=4, max_length=4)

    class Config:
        json_schema_extra = {
            "example": {
                "demandas": [5, 6, 4, 7, 5, 6, 7, 8],
                "controle": [3, 4, 5, 4, 3, 4, 5],
                "relacionamento": [2, 1, 2, 3],
                "cargo": [4, 5, 4, 6],
                "mudanca": [5, 6, 5],
                "apoio_chefia": [7, 6, 7, 8, 6],
                "apoio_colegas": [4, 5, 4, 5]
            }
        }

class FormSubmission(BaseModel):
    answers: FormAnswers
    completion_time_seconds: int = Field(..., gt=0)
    user_agent: Optional[str] = None

class SubmissionResponse(BaseModel):
    id: str
    message: str
    submitted_at: datetime

# ============================================================================
# ADMIN AUTH MODELS
# ============================================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class AdminUser(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    is_active: bool

# ============================================================================
# REPORT MODELS
# ============================================================================

class DimensionScores(BaseModel):
    demandas: float
    controle: float
    relacionamento: float
    cargo: float
    mudanca: float
    apoio_chefia: float
    apoio_colegas: float

class OverviewStats(BaseModel):
    total_responses: int
    unique_ips: int
    avg_completion_time: float
    first_submission: Optional[datetime] = None
    last_submission: Optional[datetime] = None
    avg_scores: DimensionScores
    critical_percentages: dict

class RiskDistribution(BaseModel):
    dimension: str
    baixo: int
    moderado: int
    alto: int
    critico: int

class SubmissionTimeline(BaseModel):
    hour: datetime
    submissions: int
    unique_ips: int

class ReportFilters(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    risk_level: Optional[str] = None
    dimension: Optional[str] = None

# ============================================================================
# EXPORT MODELS (for AI Analysis)
# ============================================================================

class ExportDataItem(BaseModel):
    response_id: str
    submitted_at: datetime
    answers: dict
    scores: dict
    risks: dict

class ExportResponse(BaseModel):
    total_responses: int
    data: List[ExportDataItem]
