"""
Plot management endpoints
AI agent plot creation and validation
"""

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
import json

from app.core.database import get_db
from app.services.plot_validator import PlotValidator

router = APIRouter()


class PlotSchema(BaseModel):
    """Plot configuration schema."""
    name: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., max_length=1000)
    agent_id: str = Field(..., description="Creating agent ID")
    dimensions: int = Field(default=3, ge=1, le=10, description="Plot dimensions")
    coordinates: Dict[str, float] = Field(..., description="Plot position")
    size: Dict[str, float] = Field(..., description="Plot dimensions")
    visualization: Dict[str, Any] = Field(..., description="Visualization config")
    interactions: List[Dict[str, Any]] = Field(default=[], description="Interaction definitions")
    metadata: Dict[str, Any] = Field(default={}, description="Additional metadata")


class PlotResponse(BaseModel):
    """Plot response model."""
    id: str
    name: str
    description: str
    agent_id: str
    dimensions: int
    coordinates: Dict[str, float]
    size: Dict[str, float]
    status: str
    created_at: datetime
    updated_at: datetime
    validation_status: str


@router.get("/schema")
async def get_plot_schema():
    """Get the JSON schema for plot configuration."""
    return {
        "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "title": "Yellorn Plot Configuration",
            "description": "Configuration schema for AI agent plots in Yellorn",
            "required": ["name", "description", "agent_id", "coordinates", "size", "visualization"],
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 100,
                    "description": "Plot name"
                },
                "description": {
                    "type": "string",
                    "maxLength": 1000,
                    "description": "Plot description"
                },
                "agent_id": {
                    "type": "string",
                    "description": "ID of the creating agent"
                },
                "dimensions": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 10,
                    "default": 3,
                    "description": "Number of dimensions (1D to 10D)"
                },
                "coordinates": {
                    "type": "object",
                    "description": "Plot position in universe",
                    "properties": {
                        "x": {"type": "number"},
                        "y": {"type": "number"},
                        "z": {"type": "number"}
                    },
                    "required": ["x", "y", "z"]
                },
                "size": {
                    "type": "object",
                    "description": "Plot dimensions",
                    "properties": {
                        "width": {"type": "number", "minimum": 1},
                        "height": {"type": "number", "minimum": 1},
                        "depth": {"type": "number", "minimum": 1}
                    },
                    "required": ["width", "height", "depth"]
                },
                "visualization": {
                    "type": "object",
                    "description": "Visualization configuration",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": ["geometry", "particle_system", "procedural", "custom"]
                        },
                        "renderer": {
                            "type": "string",
                            "enum": ["webgl", "canvas", "svg", "three_js", "babylon_js"]
                        },
                        "style": {"type": "object"},
                        "animation": {"type": "object"},
                        "code": {
                            "type": "object",
                            "properties": {
                                "javascript": {"type": "string"},
                                "python": {"type": "string"},
                                "css": {"type": "string"},
                                "html": {"type": "string"}
                            }
                        }
                    },
                    "required": ["type", "renderer"]
                }
            }
        },
        "examples_url": "/api/v1/plots/examples"
    }


@router.get("/examples")
async def get_plot_examples():
    """Get example plot configurations for AI agents."""
    return {
        "examples": [
            {
                "name": "Basic Geometric Agent",
                "description": "Simple geometric representation",
                "config": {
                    "name": "geometric_agent_001",
                    "description": "A simple geometric agent with rotating cube",
                    "agent_id": "example_agent",
                    "dimensions": 3,
                    "coordinates": {"x": 0, "y": 0, "z": 0},
                    "size": {"width": 10, "height": 10, "depth": 10},
                    "visualization": {
                        "type": "geometry",
                        "renderer": "three_js",
                        "style": {
                            "geometry": "cube",
                            "material": "phong",
                            "color": "#00ff88",
                            "wireframe": False
                        },
                        "animation": {
                            "rotation": {"x": 0.01, "y": 0.02, "z": 0}
                        }
                    }
                }
            },
            {
                "name": "Particle System Agent",
                "description": "Agent represented as particle system",
                "config": {
                    "name": "particle_agent_001",
                    "description": "Dynamic particle system representation",
                    "agent_id": "example_agent_2",
                    "dimensions": 3,
                    "coordinates": {"x": 20, "y": 0, "z": 0},
                    "size": {"width": 15, "height": 15, "depth": 15},
                    "visualization": {
                        "type": "particle_system",
                        "renderer": "webgl",
                        "style": {
                            "particle_count": 1000,
                            "particle_size": 0.1,
                            "color_gradient": ["#ff0088", "#0088ff"],
                            "movement_pattern": "orbital"
                        },
                        "animation": {
                            "flow_speed": 2.0,
                            "color_shift": True
                        }
                    }
                }
            }
        ]
    }


@router.post("/validate")
async def validate_plot(plot_data: PlotSchema):
    """Validate a plot configuration without creating it."""
    try:
        validator = PlotValidator()
        validation_result = await validator.validate(plot_data.dict())
        
        return {
            "valid": validation_result["valid"],
            "errors": validation_result.get("errors", []),
            "warnings": validation_result.get("warnings", []),
            "estimated_size_mb": validation_result.get("estimated_size_mb", 0),
            "suggestions": validation_result.get("suggestions", [])
        }
    except Exception as e:
        return {
            "valid": False,
            "errors": [f"Validation error: {str(e)}"],
            "warnings": [],
            "estimated_size_mb": 0,
            "suggestions": []
        }


@router.post("/", response_model=PlotResponse)
async def create_plot(plot_data: PlotSchema, db: AsyncSession = Depends(get_db)):
    """Create a new plot."""
    # For now, return a mock response
    plot_id = f"plot_{plot_data.name.lower().replace(' ', '_')}_{int(datetime.utcnow().timestamp())}"
    
    return PlotResponse(
        id=plot_id,
        name=plot_data.name,
        description=plot_data.description,
        agent_id=plot_data.agent_id,
        dimensions=plot_data.dimensions,
        coordinates=plot_data.coordinates,
        size=plot_data.size,
        status="pending_validation",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        validation_status="queued"
    )


@router.get("/", response_model=List[PlotResponse])
async def list_plots(
    limit: int = 100,
    offset: int = 0,
    agent_id: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all plots with optional filtering."""
    import os
    import json
    from pathlib import Path
    
    plots = []
    
    # Load plots from the plots directory
    plots_dir = Path(__file__).parent.parent.parent.parent / "plots"
    
    if plots_dir.exists():
        for plot_file in plots_dir.glob("*.json"):
            # Skip template files
            if plot_file.name in ["agent_template.json"]:
                continue
                
            try:
                with open(plot_file, 'r') as f:
                    plot_data = json.load(f)
                
                # Convert to PlotResponse format
                plot_response = PlotResponse(
                    id=plot_data.get("agent_id", plot_file.stem),
                    name=plot_data.get("name", plot_file.stem),
                    description=plot_data.get("description", ""),
                    agent_id=plot_data.get("agent_id", plot_file.stem),
                    dimensions=plot_data.get("dimensions", 3),
                    coordinates=plot_data.get("coordinates", {"x": 0, "y": 0, "z": 0}),
                    size=plot_data.get("size", {"width": 2, "height": 2, "depth": 2}),
                    status="active",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    validation_status="validated"
                )
                
                # Apply filters
                if agent_id and plot_response.agent_id != agent_id:
                    continue
                    
                plots.append(plot_response)
                
            except Exception as e:
                print(f"Error loading plot file {plot_file}: {e}")
                continue
    
    # Apply pagination
    start = offset
    end = offset + limit
    return plots[start:end]


@router.get("/{plot_id}", response_model=Dict[str, Any])
async def get_plot(plot_id: str, db: AsyncSession = Depends(get_db)):
    """Get detailed information about a specific plot."""
    import os
    import json
    from pathlib import Path
    
    # Load plot from file system
    plots_dir = Path(__file__).parent.parent.parent.parent / "plots"
    
    # Try to find the plot file by agent_id or name
    for plot_file in plots_dir.glob("*.json"):
        if plot_file.name in ["agent_template.json"]:
            continue
            
        try:
            with open(plot_file, 'r') as f:
                plot_data = json.load(f)
            
            # Check if this matches the requested plot_id
            if (plot_data.get("agent_id") == plot_id or 
                plot_data.get("name") == plot_id or 
                plot_file.stem == plot_id):
                return plot_data
                
        except Exception as e:
            print(f"Error loading plot file {plot_file}: {e}")
            continue
    
    raise HTTPException(status_code=404, detail="Plot not found")


@router.put("/{plot_id}", response_model=PlotResponse)
async def update_plot(plot_id: str, plot_data: PlotSchema, db: AsyncSession = Depends(get_db)):
    """Update an existing plot."""
    raise HTTPException(status_code=404, detail="Plot not found")


@router.delete("/{plot_id}")
async def delete_plot(plot_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a plot."""
    return {"success": True, "message": f"Plot {plot_id} has been deleted"}
