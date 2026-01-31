from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import LoginRequest, TokenResponse, AdminUser
from app.services import n8n_service
from app.services.auth import decode_access_token

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])
security = HTTPBearer()

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    try:
        result = await n8n_service.login_admin(credentials.email, credentials.password)
        return TokenResponse(
            access_token=result["access_token"],
            token_type=result["token_type"],
            expires_in=result["expires_in"]
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    
    admin_id = payload.get("sub")
    email = payload.get("email")
    
    if not admin_id or not email:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return {"id": admin_id, "email": email, "is_active": True}

@router.get("/me", response_model=AdminUser)
async def get_me(admin: dict = Depends(get_current_admin)):
    return AdminUser(
        id=admin["id"],
        email=admin["email"],
        full_name="Administrador",
        created_at="2026-01-30T00:00:00Z",
        last_login=None,
        is_active=True
    )
