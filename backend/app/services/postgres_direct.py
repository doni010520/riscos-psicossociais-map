# ============================================================================
# POSTGRES DIRECT: Conexão direta ao PostgreSQL (bypass PostgREST)
# ============================================================================

import asyncpg
import os
import ssl
from typing import Optional
from datetime import datetime

# Pool de conexões
_pool: Optional[asyncpg.Pool] = None

async def get_pool() -> asyncpg.Pool:
    """Retorna pool de conexões PostgreSQL"""
    global _pool
    if _pool is None:
        # Configurar SSL (obrigatório no Supabase)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        # Usar variáveis separadas ao invés de URL
        _pool = await asyncpg.create_pool(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", "6543")),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            ssl=ssl_context,
            min_size=1,
            max_size=10,
            command_timeout=60
        )
    return _pool

async def get_admin_by_email_direct(email: str) -> Optional[dict]:
    """Busca admin diretamente no PostgreSQL"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, email, password_hash, full_name, is_active, created_at, last_login
            FROM admin_users 
            WHERE email = $1 AND is_active = true
            """,
            email
        )
        if row:
            return {
                "id": str(row["id"]),
                "email": row["email"],
                "password_hash": row["password_hash"],
                "full_name": row["full_name"],
                "is_active": row["is_active"],
                "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                "last_login": row["last_login"].isoformat() if row["last_login"] else None,
            }
        return None

async def update_admin_last_login_direct(admin_id: str):
    """Atualiza last_login diretamente no PostgreSQL"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE admin_users SET last_login = $1 WHERE id = $2",
            datetime.utcnow(),
            admin_id
        )
```

---

## ✅ TESTE 3: Tentar porta 5432 (Direct Connection)

Pode ser que a porta 6543 (pooler) não aceite essa senha. Tenta com porta direta:

**No Easypanel → Environment, muda:**
```
DB_PORT=5432
