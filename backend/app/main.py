from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import os

from app.routers import form, auth, admin

app = FastAPI(
    title="API Riscos Psicossociais MAP",
    description="API para avaliação de riscos psicossociais no trabalho",
    version="1.0.0"
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

app.include_router(form.router)
app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    print("🚀 API Riscos Psicossociais MAP iniciada!")
    print(f"📍 Ambiente: {os.getenv('PYTHON_ENV', 'development')}")
    print(f"📊 N8N URL: {os.getenv('N8N_BASE_URL', 'https://benitech-n8n.x3t6qy.easypanel.host/webhook')}")
    print("✅ Todos os routers carregados")
    print("🔗 Documentação: http://localhost:8000/docs")

@app.on_event("shutdown")
async def shutdown_event():
    print("👋 API Riscos Psicossociais MAP encerrada!")
