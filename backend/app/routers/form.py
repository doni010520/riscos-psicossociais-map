# ============================================================================
# FORM ROUTER: Endpoints para submissão do formulário
# ============================================================================

from fastapi import APIRouter, Request, HTTPException
from app.models import FormSubmission, SubmissionResponse
from app.services import supabase_service
from datetime import datetime

router = APIRouter(prefix="/api/form", tags=["Formulário"])

# ============================================================================
# SUBMIT FORM
# ============================================================================

@router.post("/submit", response_model=SubmissionResponse)
async def submit_form(
    submission: FormSubmission,
    request: Request
):
    """
    Recebe as respostas do formulário (100% anônimo)
    
    - **answers**: Respostas organizadas por dimensão
    - **completion_time_seconds**: Tempo total de preenchimento
    - **user_agent**: User agent do navegador (opcional)
    """
    try:
        # Pegar IP real do cliente
        client_ip = request.client.host
        if "x-forwarded-for" in request.headers:
            client_ip = request.headers["x-forwarded-for"].split(",")[0].strip()
        
        # Inserir no banco
        result = await supabase_service.insert_response(
            ip_address=client_ip,
            answers=submission.answers.dict(),
            completion_time_seconds=submission.completion_time_seconds,
            user_agent=submission.user_agent
        )
        
        # Registrar no log
        await supabase_service.log_access(
            ip_address=client_ip,
            action="form_submit",
            metadata={"completion_time": submission.completion_time_seconds}
        )
        
        return SubmissionResponse(
            id=result["id"],
            message="Formulário enviado com sucesso!",
            submitted_at=datetime.fromisoformat(result["submitted_at"])
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar formulário: {str(e)}"
        )

# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get("/health")
async def form_health():
    """Health check do serviço de formulário"""
    return {"status": "healthy", "service": "form"}
