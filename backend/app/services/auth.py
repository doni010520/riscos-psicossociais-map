# ============================================================================
# AUTH ROUTER: Endpoints de autenticação admin
# ============================================================================

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import LoginRequest, TokenResponse, AdminUser
from app.services.auth import verify_password, create_access_token, decode_access_token
from app.services import supabase_service
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])
security = HTTPBearer()

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Login admin"""
    admin = await supabase_service.get_admin_by_email(credentials.email)
    
    if not admin:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    if not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    access_token = create_access_token(
        data={"sub": admin["id"], "email": admin["email"]},
        expires_delta=timedelta(hours=24)
    )
    
    await supabase_service.update_admin_last_login(admin["id"])
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=86400
    )

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency para verificar autenticação"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    
    admin_id = payload.get("sub")
    email = payload.get("email")
    
    if not admin_id or not email:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    admin = await supabase_service.get_admin_by_email(email)
    
    if not admin or not admin["is_active"]:
        raise HTTPException(status_code=401, detail="Usuário inativo ou não encontrado")
    
    return admin

@router.get("/me", response_model=AdminUser)
async def get_me(admin: dict = Depends(get_current_admin)):
    """Retorna dados do admin autenticado"""
    return AdminUser(
        id=admin["id"],
        email=admin["email"],
        full_name=admin.get("full_name"),
        created_at=admin["created_at"],
        last_login=admin.get("last_login"),
        is_active=admin["is_active"]
    )
```

---

## 📦 ARQUIVO 3: requirements.txt (REMOVER asyncpg)

**Caminho:** `backend/requirements.txt`

**REMOVE a linha:**
```
asyncpg==0.29.0
