from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.grants import router as grants_router
from app.routes.proposals import router as proposals_router
from app.routes.audit import router as audit_router

app = FastAPI(
    title="GrantCraft AI Service",
    description="AI and RAG backend for GrantCraft",
    version="1.0.0"
)

app.include_router(health_router)
app.include_router(grants_router)
app.include_router(proposals_router)
app.include_router(audit_router)

@app.get("/")
def root():
    return {
        "message": "GrantCraft AI Service is running"
    }