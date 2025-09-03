"""
Health check endpoints
System status and diagnostics for AI agents - Simplified for JSON storage
"""

from fastapi import APIRouter
import time
import os
from datetime import datetime
from pathlib import Path

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "yellorn-genesis-shard",
        "storage": "json_files",
    }


@router.get("/detailed")
async def detailed_health():
    """Detailed health check with storage connectivity."""
    start_time = time.time()

    # Test file system access
    try:
        plots_dir = Path(__file__).parent.parent.parent.parent.parent / "plots"
        plots_exist = plots_dir.exists()
        plot_count = len(list(plots_dir.glob("*.json"))) if plots_exist else 0
        storage_status = "accessible"
        storage_error = None
    except Exception as e:
        storage_status = "error"
        storage_error = str(e)
        plot_count = 0

    response_time = time.time() - start_time

    return {
        "status": "healthy" if storage_status == "accessible" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "yellorn-genesis-shard",
        "storage": {
            "type": "json_files",
            "status": storage_status,
            "error": storage_error,
            "plots_directory_exists": plots_exist,
            "total_plots": plot_count,
        },
        "response_time_ms": round(response_time * 1000, 2),
        "components": {
            "api": "operational",
            "storage": storage_status,
            "agent_validation": "operational",
        },
    }
