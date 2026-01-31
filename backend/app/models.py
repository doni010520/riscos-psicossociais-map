from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, List
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400

class AdminUser(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: str
    last_login: Optional[str] = None
    is_active: bool = True

class FormSubmission(BaseModel):
    answers: Dict[str, List[int]]
    completion_time_seconds: int
    user_agent: Optional[str] = None

class OverviewStats(BaseModel):
    total_responses: int
    avg_completion_time: float
    unique_ips: int
    responses_last_24h: int
    responses_last_7d: int
    responses_last_30d: int

class RiskDistribution(BaseModel):
    dimension: str
    baixo: int
    moderado: int
    alto: int
    critico: int

class SubmissionTimeline(BaseModel):
    hour: str
    submissions: int
    unique_ips: int

class ReportFilters(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    risk_level: Optional[str] = None
    dimension: Optional[str] = None

class ExportResponse(BaseModel):
    total_responses: int
    data: List[Dict]
