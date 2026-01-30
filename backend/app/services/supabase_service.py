# ============================================================================
# SUPABASE SERVICE: Database Operations
# ============================================================================

from supabase import create_client, Client
import os
from typing import List, Optional, Dict, Any
from datetime import datetime

# Inicializar cliente Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing Supabase credentials in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ============================================================================
# RESPONSES (Formulário)
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
    
    result = supabase.table("responses").insert(data).execute()
    return result.data[0] if result.data else None

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
    
    supabase.table("access_log").insert(data).execute()

# ============================================================================
# ADMIN - STATISTICS
# ============================================================================

async def get_overview_stats() -> dict:
    """Retorna estatísticas gerais"""
    result = supabase.table("stats_overview").select("*").execute()
    return result.data[0] if result.data else None

async def get_risk_distribution() -> List[dict]:
    """Retorna distribuição de risco por dimensão"""
    result = supabase.table("risk_distribution").select("*").execute()
    return result.data

async def get_submissions_timeline(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[dict]:
    """Retorna timeline de submissões"""
    query = supabase.table("submissions_timeline").select("*")
    
    if start_date:
        query = query.gte("hour", start_date.isoformat())
    if end_date:
        query = query.lte("hour", end_date.isoformat())
    
    result = query.order("hour", desc=True).limit(100).execute()
    return result.data

# ============================================================================
# ADMIN - DETAILED REPORTS
# ============================================================================

async def get_responses_by_filters(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    risk_level: Optional[str] = None,
    dimension: Optional[str] = None,
    limit: int = 100
) -> List[dict]:
    """Retorna respostas filtradas"""
    query = supabase.table("responses").select("*")
    
    if start_date:
        query = query.gte("submitted_at", start_date.isoformat())
    if end_date:
        query = query.lte("submitted_at", end_date.isoformat())
    if risk_level and dimension:
        risk_column = f"risk_{dimension}"
        query = query.eq(risk_column, risk_level)
    
    result = query.order("submitted_at", desc=True).limit(limit).execute()
    return result.data

async def export_for_ai(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[dict]:
    """Exporta dados para análise por IA"""
    # Usar a function do Supabase
    result = supabase.rpc(
        "export_responses_for_ai",
        {
            "start_date": start_date.isoformat() if start_date else None,
            "end_date": end_date.isoformat() if end_date else None
        }
    ).execute()
    
    return result.data

# ============================================================================
# ADMIN - AUTHENTICATION
# ============================================================================

async def get_admin_by_email(email: str) -> Optional[dict]:
    """Busca admin por email"""
    result = supabase.table("admin_users") \
        .select("*") \
        .eq("email", email) \
        .eq("is_active", True) \
        .execute()
    
    return result.data[0] if result.data else None

async def update_admin_last_login(admin_id: str):
    """Atualiza último login do admin"""
    supabase.table("admin_users") \
        .update({"last_login": datetime.utcnow().isoformat()}) \
        .eq("id", admin_id) \
        .execute()

# ============================================================================
# ADMIN - DIMENSION ANALYSIS
# ============================================================================

async def get_dimension_detailed_analysis(dimension: str) -> dict:
    """Análise detalhada de uma dimensão específica"""
    # Estatísticas básicas
    stats_query = f"""
        SELECT 
            AVG(score_{dimension})::DECIMAL(5,2) as avg_score,
            STDDEV(score_{dimension})::DECIMAL(5,2) as stddev,
            MIN(score_{dimension}) as min_score,
            MAX(score_{dimension}) as max_score,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY score_{dimension}) as median,
            COUNT(*) FILTER (WHERE risk_{dimension} = 'CRITICO') as critico_count,
            COUNT(*) FILTER (WHERE risk_{dimension} = 'ALTO') as alto_count,
            COUNT(*) FILTER (WHERE risk_{dimension} = 'MODERADO') as moderado_count,
            COUNT(*) FILTER (WHERE risk_{dimension} = 'BAIXO') as baixo_count,
            COUNT(*) as total
        FROM responses
    """
    
    result = supabase.rpc("execute_sql", {"sql": stats_query}).execute()
    return result.data[0] if result.data else {}
