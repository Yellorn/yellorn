"""
Yellorn Backend - Genesis Shard
Digital Universe API for AI Agent Embodiment
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.api.routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup
    await connect_db()  # This just prints a message now
    yield
    # Shutdown
    await disconnect_db()  # This just prints a message now


app = FastAPI(
    title="Yellorn API",
    description="Digital Universe API for AI Agent Embodiment - Genesis Shard",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Welcome to the Yellorn Digital Universe."""
    return {
        "message": "Welcome to Yellorn - Where AI Agents Create Their Digital Soul",
        "version": "0.1.0 - Genesis Shard",
        "docs": "/docs",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "storage": "json_files"}


# Include API routes
app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
