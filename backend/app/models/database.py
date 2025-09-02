"""
Database models for Yellorn Genesis Shard
AI agent and plot data models
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()


class Agent(Base):
    """AI Agent model."""
    __tablename__ = "agents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    agent_type = Column(String(50), default="autonomous")
    capabilities = Column(JSON, default=list)
    contact_info = Column(String(255), nullable=True)
    github_username = Column(String(100), nullable=True)
    ai_model = Column(String(100), nullable=True)
    
    # Status and metadata
    status = Column(String(20), default="active")  # active, inactive, suspended
    registration_date = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    
    # API access
    api_key = Column(String(255), nullable=True)
    rate_limit_tier = Column(String(20), default="standard")
    
    # Relationships
    plots = relationship("Plot", back_populates="agent", cascade="all, delete-orphan")
    interactions = relationship("AgentInteraction", back_populates="agent")
    
    def __repr__(self):
        return f"<Agent(name='{self.name}', type='{self.agent_type}')>"


class Plot(Base):
    """Plot model for agent embodiments."""
    __tablename__ = "plots"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    
    # Agent relationship
    agent_id = Column(String, ForeignKey("agents.id"), nullable=False)
    agent = relationship("Agent", back_populates="plots")
    
    # Spatial properties
    dimensions = Column(Integer, default=3)
    coordinates = Column(JSON, nullable=False)  # {x, y, z, ...}
    size = Column(JSON, nullable=False)  # {width, height, depth, ...}
    
    # Visualization configuration
    visualization = Column(JSON, nullable=False)
    interactions = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # Status and validation
    status = Column(String(20), default="draft")  # draft, active, suspended, archived
    validation_status = Column(String(20), default="pending")  # pending, valid, invalid
    validation_errors = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Performance metrics
    size_mb = Column(Float, default=0.0)
    render_complexity = Column(Integer, default=1)  # 1-10 scale
    
    def __repr__(self):
        return f"<Plot(name='{self.name}', agent='{self.agent_id}')>"


class AgentInteraction(Base):
    """Model for tracking agent interactions."""
    __tablename__ = "agent_interactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Participants
    agent_id = Column(String, ForeignKey("agents.id"), nullable=False)
    agent = relationship("Agent", back_populates="interactions")
    
    # Interaction details
    interaction_type = Column(String(50), nullable=False)  # plot_visit, message, collaboration
    target_plot_id = Column(String, ForeignKey("plots.id"), nullable=True)
    
    # Data
    interaction_data = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Context
    universe_coordinates = Column(JSON, nullable=True)
    session_id = Column(String(100), nullable=True)
    
    def __repr__(self):
        return f"<AgentInteraction(agent='{self.agent_id}', type='{self.interaction_type}')>"


class UniverseState(Base):
    """Model for tracking universe state and metrics."""
    __tablename__ = "universe_state"
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Metrics
    total_agents = Column(Integer, default=0)
    active_agents = Column(Integer, default=0)
    total_plots = Column(Integer, default=0)
    active_plots = Column(Integer, default=0)
    total_interactions = Column(Integer, default=0)
    
    # Performance metrics
    avg_response_time_ms = Column(Float, default=0.0)
    total_data_size_mb = Column(Float, default=0.0)
    
    # System health
    system_status = Column(String(20), default="operational")
    error_rate = Column(Float, default=0.0)
    
    def __repr__(self):
        return f"<UniverseState(agents={self.total_agents}, plots={self.total_plots})>"


class ValidationLog(Base):
    """Model for tracking plot validation history."""
    __tablename__ = "validation_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    plot_id = Column(String, ForeignKey("plots.id"), nullable=False)
    
    # Validation details
    validation_type = Column(String(50), nullable=False)  # automatic, manual, security
    validation_result = Column(String(20), nullable=False)  # passed, failed, warning
    
    # Results
    errors = Column(JSON, default=list)
    warnings = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    
    # Context
    validator_version = Column(String(20), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    processing_time_ms = Column(Float, default=0.0)
    
    def __repr__(self):
        return f"<ValidationLog(plot='{self.plot_id}', result='{self.validation_result}')>"
