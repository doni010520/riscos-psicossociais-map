# ============================================================================
# ADMIN ROUTER: Endpoints de dashboard e relatórios
# ============================================================================

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.models import (
    OverviewStats, RiskDistribution, SubmissionTimeline,
    ReportFilters, ExportResponse
)
from app.services import supabase_service
from app.routers.auth import get_current_admin
from typing import List
import json
import io

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ============================================================================
# OVERVIEW / DASHBOARD
# ============================================================================

@router.get("/stats/overview", response_model=OverviewStats)
async def get_overview(admin: dict = Depends(get_current_admin)):
    """
    Estatísticas gerais do dashboard
    
    Requer autenticação admin.
    """
    stats = await supabase_service.get_overview_stats()
    
    if not stats:
        raise HTTPException(
            status_code=404,
            detail="Nenhuma resposta encontrada"
        )
    
    return stats

@router.get("/stats/risk-distribution", response_model=List[RiskDistribution])
async def get_risk_distribution(admin: dict = Depends(get_current_admin)):
    """
    Distribuição de risco por dimensão
    
    Retorna contagem de respostas em cada nível de risco para cada dimensão.
    """
    distribution = await supabase_service.get_risk_distribution()
    return distribution

@router.get("/stats/timeline", response_model=List[SubmissionTimeline])
async def get_timeline(
    filters: ReportFilters = Depends(),
    admin: dict = Depends(get_current_admin)
):
    """
    Timeline de submissões (por hora)
    
    Mostra quando as respostas foram enviadas ao longo do tempo.
    """
    timeline = await supabase_service.get_submissions_timeline(
        start_date=filters.start_date,
        end_date=filters.end_date
    )
    return timeline

# ============================================================================
# DETAILED REPORTS
# ============================================================================

@router.post("/reports/filtered")
async def get_filtered_responses(
    filters: ReportFilters,
    admin: dict = Depends(get_current_admin)
):
    """
    Respostas filtradas por parâmetros
    
    - **start_date**: Data inicial (opcional)
    - **end_date**: Data final (opcional)
    - **risk_level**: Nível de risco (BAIXO, MODERADO, ALTO, CRITICO)
    - **dimension**: Dimensão específica
    """
    responses = await supabase_service.get_responses_by_filters(
        start_date=filters.start_date,
        end_date=filters.end_date,
        risk_level=filters.risk_level,
        dimension=filters.dimension
    )
    
    return {
        "total": len(responses),
        "filters": filters.dict(),
        "data": responses
    }

@router.get("/reports/dimension/{dimension}")
async def get_dimension_analysis(
    dimension: str,
    admin: dict = Depends(get_current_admin)
):
    """
    Análise detalhada de uma dimensão específica
    
    - **dimension**: demandas, controle, relacionamento, cargo, mudanca, apoio_chefia, apoio_colegas
    """
    valid_dimensions = [
        "demandas", "controle", "relacionamento", "cargo",
        "mudanca", "apoio_chefia", "apoio_colegas"
    ]
    
    if dimension not in valid_dimensions:
        raise HTTPException(
            status_code=400,
            detail=f"Dimensão inválida. Use uma de: {', '.join(valid_dimensions)}"
        )
    
    analysis = await supabase_service.get_dimension_detailed_analysis(dimension)
    return analysis

# ============================================================================
# EXPORT (for AI Analysis)
# ============================================================================

@router.post("/export/ai", response_model=ExportResponse)
async def export_for_ai(
    filters: ReportFilters,
    admin: dict = Depends(get_current_admin)
):
    """
    Exporta dados para análise por IA externa
    
    Retorna respostas estruturadas com pontuações e níveis de risco.
    Ideal para análise por modelos de IA/ML.
    """
    data = await supabase_service.export_for_ai(
        start_date=filters.start_date,
        end_date=filters.end_date
    )
    
    return ExportResponse(
        total_responses=len(data),
        data=data
    )

@router.post("/export/csv")
async def export_csv(
    filters: ReportFilters,
    admin: dict = Depends(get_current_admin)
):
    """
    Exporta dados em formato CSV
    
    Retorna arquivo CSV para download.
    """
    responses = await supabase_service.get_responses_by_filters(
        start_date=filters.start_date,
        end_date=filters.end_date,
        risk_level=filters.risk_level,
        dimension=filters.dimension,
        limit=10000  # Limite maior para export
    )
    
    # Gerar CSV
    output = io.StringIO()
    
    # Header
    output.write("id,submitted_at,ip_address,completion_time_seconds,")
    output.write("score_demandas,score_controle,score_relacionamento,")
    output.write("score_cargo,score_mudanca,score_apoio_chefia,score_apoio_colegas,")
    output.write("risk_demandas,risk_controle,risk_relacionamento,")
    output.write("risk_cargo,risk_mudanca,risk_apoio_chefia,risk_apoio_colegas\n")
    
    # Data
    for r in responses:
        output.write(f"{r['id']},{r['submitted_at']},{r['ip_address']},")
        output.write(f"{r['completion_time_seconds']},")
        output.write(f"{r['score_demandas']},{r['score_controle']},")
        output.write(f"{r['score_relacionamento']},{r['score_cargo']},")
        output.write(f"{r['score_mudanca']},{r['score_apoio_chefia']},")
        output.write(f"{r['score_apoio_colegas']},")
        output.write(f"{r['risk_demandas']},{r['risk_controle']},")
        output.write(f"{r['risk_relacionamento']},{r['risk_cargo']},")
        output.write(f"{r['risk_mudanca']},{r['risk_apoio_chefia']},")
        output.write(f"{r['risk_apoio_colegas']}\n")
    
    # Retornar como streaming response
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=riscos_psicossociais.csv"
        }
    )

# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get("/health")
async def admin_health(admin: dict = Depends(get_current_admin)):
    """Health check do serviço admin (requer autenticação)"""
    return {
        "status": "healthy",
        "service": "admin",
        "admin_email": admin["email"]
    }
