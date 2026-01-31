from fastapi import APIRouter
from app.models import LoginRequest, TokenResponse
from app.services import n8n_service

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """N8N faz tudo: busca, verifica senha, gera token"""
    result = await n8n_service.get_admin_by_email(credentials.email)
    return result
