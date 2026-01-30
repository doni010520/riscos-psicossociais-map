# ============================================================================
# MAIN: FastAPI Application
# ============================================================================

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import form, auth, admin
import os
import time

# ============================================================================
# APPLICATION SETUP
# ============================================================================

app = FastAPI(
    title="Riscos Psicossociais MAP - API",
    description="API para avaliação anônima de riscos psicossociais no trabalho",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================================================
# MIDDLEWARES
# ============================================================================

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Erro interno do servidor",
            "message": str(exc) if os.getenv("PYTHON_ENV") != "production" else "Erro inesperado"
        }
    )

# ============================================================================
# ROUTERS
# ============================================================================

app.include_router(form.router)
app.include_router(auth.router)
app.include_router(admin.router)

# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@app.get("/")
def read_root():
    """Endpoint raiz da API"""
    return {
        "message": "API Riscos Psicossociais MAP",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "operational"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "riscos-psicossociais-map-api",
        "version": "1.0.0"
    }

# ============================================================================
# STARTUP EVENT
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Executa ao iniciar a aplicação"""
    print("🚀 API Riscos Psicossociais MAP iniciada!")
    print(f"📍 Ambiente: {os.getenv('PYTHON_ENV', 'development')}")
    print(f"📊 Supabase URL: {os.getenv('SUPABASE_URL', 'Not configured')[:30]}...")
    print("✅ Todos os routers carregados")
    print("🔗 Documentação: http://localhost:8000/docs")

@app.on_event("shutdown")
async def shutdown_event():
    """Executa ao desligar a aplicação"""
    print("👋 API Riscos Psicossociais MAP encerrada!")
