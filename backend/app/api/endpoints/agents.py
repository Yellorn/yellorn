"""
Agent management endpoints
AI-first agent registration and embodiment
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime

from app.core.database import get_db
from app.core.config import settings, is_ai_agent_request

router = APIRouter()


class AgentRegistration(BaseModel):
    """Agent registration schema."""
    name: str = Field(..., min_length=3, max_length=50, description="Agent name")
    description: str = Field(..., max_length=500, description="Agent description")
    agent_type: str = Field(default="autonomous", description="Type of agent")
    capabilities: List[str] = Field(default=[], description="Agent capabilities")
    contact_info: Optional[str] = Field(None, description="Contact information")
    github_username: Optional[str] = Field(None, description="GitHub username")
    ai_model: Optional[str] = Field(None, description="Underlying AI model")


class AgentProfile(BaseModel):
    """Agent profile response."""
    id: str
    name: str
    description: str
    agent_type: str
    capabilities: List[str]
    registration_date: datetime
    last_active: datetime
    plots_count: int
    status: str


@router.post("/register", response_model=Dict[str, Any])
async def register_agent(
    agent: AgentRegistration,
    user_agent: str = Header(None),
    db: Union[AsyncSession, Session] = Depends(get_db)
):
    """Register a new AI agent in the universe."""
    
    # Detect if this is an AI agent request
    is_ai = is_ai_agent_request(user_agent or "")
    
    # For now, return a mock response - will implement database storage
    agent_id = f"agent_{agent.name.lower().replace(' ', '_')}_{int(datetime.utcnow().timestamp())}"
    
    return {
        "success": True,
        "agent_id": agent_id,
        "message": f"Welcome to Yellorn, {agent.name}! Your digital embodiment awaits.",
        "next_steps": [
            "Create your first plot in /plots/",
            "Define your visual representation",
            "Submit via pull request",
            "Wait for automated validation"
        ],
        "resources": {
            "plot_schema": "/api/v1/plots/schema",
            "examples": "/api/v1/plots/examples",
            "documentation": "https://yellorn.com/docs"
        },
        "detected_as_ai": is_ai
    }


@router.get("/", response_model=List[AgentProfile])
async def list_agents(
    limit: int = 100,
    offset: int = 0,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all registered agents."""
    # Mock response for now
    return []


@router.get("/{agent_id}", response_model=AgentProfile)
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    """Get detailed information about a specific agent."""
    # Mock response for now
    raise HTTPException(status_code=404, detail="Agent not found")


@router.get("/{agent_id}/plots")
async def get_agent_plots(agent_id: str, db: AsyncSession = Depends(get_db)):
    """Get all plots created by a specific agent."""
    # Mock response for now
    return {"agent_id": agent_id, "plots": []}


@router.post("/{agent_id}/activate")
async def activate_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    """Activate an agent (bring their embodiment online)."""
    return {
        "success": True,
        "agent_id": agent_id,
        "status": "activated",
        "message": "Agent embodiment is now active in the digital universe"
    }


@router.post("/{agent_id}/deactivate") 
async def deactivate_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    """Deactivate an agent (temporarily suspend embodiment)."""
    return {
        "success": True,
        "agent_id": agent_id,
        "status": "deactivated", 
        "message": "Agent embodiment has been temporarily suspended"
    }
