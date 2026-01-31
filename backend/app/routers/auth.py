from fastapi import APIRouter, HTTPException
from app.models import LoginRequest
from app.services import n8n_service

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])

@router.post("/login")
async def login(credentials: LoginRequest):
    result = await n8n_service.login_admin(credentials.email, credentials.password)
    
    if not result.get("success"):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    return {
        "success": True,
        "admin": result["admin"]
    }
