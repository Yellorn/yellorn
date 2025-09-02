"""
Health check endpoints
System status and diagnostics for AI agents
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, is_async_db
import time
from datetime import datetime
from typing import Union

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "yellorn-genesis-shard"
    }


@router.get("/detailed")
async def detailed_health(db: Union[AsyncSession, Session] = Depends(get_db)):
    """Detailed health check with database connectivity."""
    start_time = time.time()
    
    # Test database connection
    try:
        if is_async_db:
            await db.execute(text("SELECT 1"))
        else:
            db.execute(text("SELECT 1"))
        db_status = "connected"
        db_error = None
    except Exception as e:
        db_status = "error"
        db_error = str(e)
    
    response_time = time.time() - start_time
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "yellorn-genesis-shard",
        "database": {
            "status": db_status,
            "error": db_error,
            "type": "async" if is_async_db else "sync"
        },
        "response_time_ms": round(response_time * 1000, 2),
        "components": {
            "api": "operational",
            "database": db_status,
            "agent_validation": "operational"
        }
    }
