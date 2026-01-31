from fastapi import APIRouter, HTTPException
from app.models import OverviewStats, RiskDistribution, SubmissionTimeline
from app.services import supabase_service
from typing import List

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats/overview", response_model=OverviewStats)
async def get_overview():
    stats = await supabase_service.get_overview_stats()
    if not stats:
        raise HTTPException(status_code=404, detail="Nenhuma estatística encontrada")
    return stats

@router.get("/stats/risk-distribution", response_model=List[RiskDistribution])
async def get_risk_distribution():
    distribution = await supabase_service.get_risk_distribution()
    return distribution

@router.get("/stats/timeline", response_model=List[SubmissionTimeline])
async def get_timeline(start_date: str = None, end_date: str = None):
    from datetime import datetime
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    timeline = await supabase_service.get_submissions_timeline(start, end)
    return timeline

@router.get("/reports/responses")
async def get_filtered_responses(start_date: str = None, end_date: str = None, risk_level: str = None, dimension: str = None, limit: int = 100):
    from datetime import datetime
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    responses = await supabase_service.get_responses_by_filters(start_date=start, end_date=end, risk_level=risk_level, dimension=dimension, limit=limit)
    return responses

@router.get("/health")
async def admin_health():
    return {"status": "healthy", "service": "admin"}
