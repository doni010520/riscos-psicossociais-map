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
import os

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ============================================================================
# DIAGNÓSTICO (SEM AUTENTICAÇÃO)
# ============================================================================

@router.get("/diagnostics")
async def diagnostics():
    """Endpoint de diagnóstico - testa conexão Supabase"""
    from supabase import create_client
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    result = {
        "env_check": {
            "url_exists": bool(url),
            "key_exists": bool(key),
            "url": url
        },
        "tests": {}
    }
    
    try:
        client = create_client(url, key)
        result["tests"]["client_created"] = True
        
        # Teste responses
        try:
            test_responses = client.table("responses").select("id").limit(1).execute()
            result["tests"]["responses"] = {
                "success": True,
                "count": len(test_responses.data) if test_responses.data else 0
            }
        except Exception as e:
            result["tests"]["responses"] = {
                "success": False,
                "error": str(e)
            }
        
        # Teste admin_users
        try:
            test_admin = client.table("admin_users").select("id").limit(1).execute()
            result["tests"]["admin_users"] = {
                "success": True,
                "count": len(test_admin.data) if test_admin.data else 0
            }
        except Exception as e:
            result["tests"]["admin_users"] = {
                "success": False,
                "error": str(e)
            }
            
    except Exception as e:
        result["tests"]["client_created"] = False
        result["tests"]["error"] = str(e)
    
    return result

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
        raise HTTPException(status_code=404, detail="Nenhuma estatística encontrada")
    
    return stats

# ============================================================================
# RISK DISTRIBUTION
# ============================================================================

@router.get("/stats/risk-distribution", response_model=List[RiskDistribution])
async def get_risk_distribution(admin: dict = Depends(get_current_admin)):
    """
    Distribuição de risco por dimensão
    
    Retorna contagem de respostas em cada nível de risco (baixo, moderado, alto, crítico)
    para cada dimensão avaliada.
    """
    distribution = await supabase_service.get_risk_distribution()
    return distribution

# ============================================================================
# SUBMISSIONS TIMELINE
# ============================================================================

@router.get("/stats/timeline", response_model=List[SubmissionTimeline])
async def get_timeline(
    start_date: str = None,
    end_date: str = None,
    admin: dict = Depends(get_current_admin)
):
    """
    Timeline de submissões
    
    Retorna série temporal com número de submissões e IPs únicos por hora.
    Opcionalmente filtra por período.
    """
    from datetime import datetime
    
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    
    timeline = await supabase_service.get_submissions_timeline(start, end)
    return timeline

# ============================================================================
# DETAILED REPORTS
# ============================================================================

@router.get("/reports/responses")
async def get_filtered_responses(
    start_date: str = None,
    end_date: str = None,
    risk_level: str = None,
    dimension: str = None,
    limit: int = 100,
    admin: dict = Depends(get_current_admin)
):
    """
    Respostas filtradas
    
    Retorna lista de respostas individuais com filtros opcionais:
    - start_date / end_date: período (ISO format)
    - risk_level: baixo, moderado, alto, critico
    - dimension: demandas, controle, relacionamento, cargo, mudanca, apoio_chefia, apoio_colegas
    - limit: número máximo de resultados (padrão: 100)
    """
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

# ============================================================================
# DIMENSION ANALYSIS
# ============================================================================

@router.get("/reports/dimension/{dimension}")
async def get_dimension_analysis(
    dimension: str,
    admin: dict = Depends(get_current_admin)
):
    """
    Análise detalhada de uma dimensão
    
    Retorna estatísticas completas sobre uma dimensão específica:
    - Média, desvio padrão, mínimo, máximo, mediana
    - Distribuição por nível de risco
    - Percentis
    """
    valid_dimensions = [
        "demandas", "controle", "relacionamento", "cargo",
        "mudanca", "apoio_chefia", "apoio_colegas"
    ]
    
    if dimension not in valid_dimensions:
        raise HTTPException(
            status_code=400,
            detail=f"Dimensão inválida. Use: {', '.join(valid_dimensions)}"
        )
    
    analysis = await supabase_service.get_dimension_detailed_analysis(dimension)
    return analysis

# ============================================================================
# EXPORT FOR AI ANALYSIS
# ============================================================================

@router.get("/export/ai", response_model=ExportResponse)
async def export_for_ai_analysis(
    start_date: str = None,
    end_date: str = None,
    admin: dict = Depends(get_current_admin)
):
    """
    Exporta dados estruturados para análise por IA
    
    Retorna todas as respostas com:
    - Respostas originais
    - Scores calculados
    - Níveis de risco
    - Metadados
    
    Formato otimizado para ser processado por LLMs.
    """
    from datetime import datetime
    
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    
    data = await supabase_service.export_for_ai(start, end)
    
    return ExportResponse(
        total_responses=len(data),
        data=data
    )

# ============================================================================
# CSV EXPORT
# ============================================================================

@router.get("/export/csv")
async def export_csv(
    start_date: str = None,
    end_date: str = None,
    admin: dict = Depends(get_current_admin)
):
    """
    Exporta dados em CSV
    
    Gera arquivo CSV com todas as respostas e análises.
    """
    from datetime import datetime
    import csv
    
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    
    data = await supabase_service.export_for_ai(start, end)
    
    # Criar CSV em memória
    output = io.StringIO()
    
    if not data:
        raise HTTPException(status_code=404, detail="Nenhum dado para exportar")
    
    # Headers
    fieldnames = [
        'id', 'submitted_at', 'ip_address',
        'score_demandas', 'risk_demandas',
        'score_controle', 'risk_controle',
        'score_relacionamento', 'risk_relacionamento',
        'score_cargo', 'risk_cargo',
        'score_mudanca', 'risk_mudanca',
        'score_apoio_chefia', 'risk_apoio_chefia',
        'score_apoio_colegas', 'risk_apoio_colegas',
        'completion_time_seconds'
    ]
    
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for item in data:
        row = {
            'id': item['response_id'],
            'submitted_at': item['submitted_at'],
            'ip_address': item.get('ip_address', ''),
            'completion_time_seconds': item.get('completion_time_seconds', 0)
        }
        
        # Adicionar scores e risks
        for dim in ['demandas', 'controle', 'relacionamento', 'cargo', 'mudanca', 'apoio_chefia', 'apoio_colegas']:
            row[f'score_{dim}'] = item['scores'].get(dim, 0)
            row[f'risk_{dim}'] = item['risks'].get(dim, '')
        
        writer.writerow(row)
    
    # Preparar resposta
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=riscos_psicossociais_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        }
    )
