from fastapi import FastAPI
from app.routes.health import router as health_router

app = FastAPI(
    title="GrantCraft AI Service",
    description="AI and RAG backend for GrantCraft",
    version="1.0.0"
)

app.include_router(health_router)


@app.get("/")
def root():
    return {
        "message": "GrantCraft AI Service is running"
    }