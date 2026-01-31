from fastapi import APIRouter, Request, HTTPException
from app.models import FormSubmission
from app.services import supabase_service

router = APIRouter(prefix="/api/form", tags=["Formulário"])

@router.post("/submit")
async def submit_form(submission: FormSubmission, request: Request):
    """Recebe e processa submissão do formulário"""
    
    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "Unknown")
    
    try:
        result = await supabase_service.insert_response(
            ip_address=ip_address,
            answers=submission.answers,
            completion_time_seconds=submission.completion_time_seconds,
            user_agent=user_agent
        )
        
        await supabase_service.log_access(
            ip_address=ip_address,
            action="form_submit",
            metadata={"response_id": result.get("id")}
        )
        
        return {
            "success": True,
            "message": "Formulário enviado com sucesso",
            "response_id": result.get("id")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar formulário: {str(e)}"
        )

@router.get("/health")
async def form_health():
    """Health check do endpoint de formulário"""
    return {"status": "healthy", "service": "form"}
