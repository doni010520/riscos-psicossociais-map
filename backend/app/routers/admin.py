from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.models import OverviewStats, RiskDistribution, SubmissionTimeline
from app.services import supabase_service
from app.routers.auth import get_current_admin
from typing import List
import io

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats/overview", response_model=OverviewStats)
async def get_overview(admin: dict = Depends(get_current_admin)):
    """Estatísticas gerais do dashboard"""
    stats = await supabase_service.get_overview_stats()
    if not stats:
        raise HTTPException(status_code=404, detail="Nenhuma estatística encontrada")
    return stats

@router.get("/stats/risk-distribution", response_model=List[RiskDistribution])
async def get_risk_distribution(admin: dict = Depends(get_current_admin)):
    """Distribuição de risco por dimensão"""
    distribution = await supabase_service.get_risk_distribution()
    return distribution

@router.get("/stats/timeline", response_model=List[SubmissionTimeline])
async def get_timeline(
    start_date: str = None,
    end_date: str = None,
    admin: dict = Depends(get_current_admin)
):
    """Timeline de submissões"""
    from datetime import datetime
    
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    
    timeline = await supabase_service.get_submissions_timeline(start, end)
    return timeline

@router.get("/reports/responses")
async def get_filtered_responses(
    start_date: str = None,
    end_date: str = None,
    risk_level: str = None,
    dimension: str = None,
    limit: int = 100,
    admin: dict = Depends(get_current_admin)
):
    """Respostas filtradas"""
    from datetime import datetime
    
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    
    responses = await supabase_service.get_responses_by_filters(
        start_date=start,
        end_date=end,
        risk_level=risk_level,
        dimension=dimension,
        limit=limit
    )
    
    return responses

@router.get("/health")
async def admin_health(admin: dict = Depends(get_current_admin)):
    """Health check do serviço admin"""
    return {
        "status": "healthy",
        "service": "admin",
        "admin_email": admin["email"]
    }
```

---

## 📁 ARQUIVO 10: backend/requirements.txt
```
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.5
pydantic[email]==2.10.5
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
httpx==0.27.0
