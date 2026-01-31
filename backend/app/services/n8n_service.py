import httpx
from typing import List, Optional, Dict, Any
from datetime import datetime

N8N_BASE_URL = "https://benitech-n8n.x3t6qy.easypanel.host/webhook"

async def make_request(endpoint: str, method: str = "POST", data: dict = None) -> Any:
    """Faz requisição para webhook N8N"""
    url = f"{N8N_BASE_URL}/{endpoint}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        if method == "GET":
            response = await client.get(url)
        else:
            response = await client.post(url, json=data or {})
        
        response.raise_for_status()
        return response.json()

# ============================================================================
# AUTH - N8N FAZ TUDO (verifica senha + gera token)
# ============================================================================

async def login_admin(email: str, password: str) -> dict:
    """Login completo no N8N (verifica senha + gera token)"""
    data = {
        "email": email,
        "password": password
    }
    
    result = await make_request("admin-login", "POST", data)
    return result

async def get_admin_by_email(email: str) -> Optional[dict]:
    """Busca admin por email (usado apenas para validação de token)"""
    try:
        result = await make_request("admin-get", "POST", {"email": email})
        return result
    except:
        return None

async def update_admin_last_login(admin_id: str):
    """Atualiza último login do admin"""
    await make_request("admin-update-login", "POST", {"admin_id": admin_id})

# ============================================================================
# FORM
# ============================================================================

async def insert_response(
    ip_address: str,
    answers: dict,
    completion_time_seconds: int,
    user_agent: Optional[str] = None
) -> dict:
    """Insere uma nova resposta no banco"""
    data = {
        "ip_address": ip_address,
        "answers": answers,
        "completion_time_seconds": completion_time_seconds,
        "user_agent": user_agent
    }
    
    result = await make_request("form-submit", "POST", data)
    return result

# ============================================================================
# ACCESS LOG
# ============================================================================

async def log_access(
    ip_address: str,
    action: str,
    metadata: Optional[dict] = None
):
    """Registra acesso no log"""
    data = {
        "ip_address": ip_address,
        "action": action,
        "metadata": metadata
    }
    
    await make_request("log-access", "POST", data)

# ============================================================================
# STATS
# ============================================================================

async def get_overview_stats() -> dict:
    """Retorna estatísticas gerais"""
    result = await make_request("stats-overview", "GET")
    return result

async def get_risk_distribution() -> List[dict]:
    """Retorna distribuição de risco por dimensão"""
    result = await make_request("stats-risk-distribution", "GET")
    return result

async def get_submissions_timeline(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[dict]:
    """Retorna timeline de submissões"""
    data = {
        "start_date": start_date.isoformat() if start_date else None,
        "end_date": end_date.isoformat() if end_date else None
    }
    
    result = await make_request("stats-timeline", "POST", data)
    return result

# ============================================================================
# REPORTS
# ============================================================================

async def get_responses_by_filters(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    risk_level: Optional[str] = None,
    dimension: Optional[str] = None,
    limit: int = 100
) -> List[dict]:
    """Retorna respostas filtradas"""
    data = {
        "start_date": start_date.isoformat() if start_date else None,
        "end_date": end_date.isoformat() if end_date else None,
        "risk_level": risk_level,
        "dimension": dimension,
        "limit": limit
    }
    
    result = await make_request("reports-filtered", "POST", data)
    return result

async def export_for_ai(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[dict]:
    """Exporta dados para análise por IA"""
    data = {
        "start_date": start_date.isoformat() if start_date else None,
        "end_date": end_date.isoformat() if end_date else None
    }
    
    result = await make_request("reports-export-ai", "POST", data)
    return result

async def get_dimension_detailed_analysis(dimension: str) -> dict:
    """Análise detalhada de uma dimensão específica"""
    data = {"dimension": dimension}
    result = await make_request("reports-dimension", "POST", data)
    return result
