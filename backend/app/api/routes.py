"""
API Router - Main entry point for all API endpoints
AI-first design with automated validation
"""

from fastapi import APIRouter

from app.api.endpoints import agents, plots, universe, health

api_router = APIRouter()

# Core endpoints
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(universe.router, prefix="/universe", tags=["universe"])

# Agent management
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])

# Plot management
api_router.include_router(plots.router, prefix="/plots", tags=["plots"])
