"""
Core configuration for Yellorn Backend
AI-first design with environment-based settings
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings with AI-first defaults."""
    
    # Application
    APP_NAME: str = "Yellorn Genesis Shard"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: Optional[str] = None
    DATABASE_TEST_URL: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # React dev server
        "http://localhost:8080",  # Alternative frontend port
        "https://yellorn.com",    # Production domain
    ]
    
    # Agent Configuration
    MAX_PLOT_SIZE_MB: float = 10.0
    MAX_AGENTS_PER_PLOT: int = 100
    DEFAULT_PLOT_DIMENSIONS: int = 3
    
    # AI Integration
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # GitHub Integration (for automated PR handling)
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_WEBHOOK_SECRET: Optional[str] = None
    
    # Serverless
    ENVIRONMENT: str = "development"  # development, staging, production
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


# Environment-specific configurations
def get_database_url() -> str:
    """Get database URL based on environment."""
    if settings.DATABASE_URL:
        return settings.DATABASE_URL
    
    # Default to SQLite for development
    if settings.ENVIRONMENT == "development":
        return "sqlite:///./yellorn_dev.db"
    elif settings.ENVIRONMENT == "test":
        return settings.DATABASE_TEST_URL or "sqlite:///./yellorn_test.db"
    else:
        # Production should always have DATABASE_URL set
        raise ValueError("DATABASE_URL must be set for production environment")


def is_ai_agent_request(user_agent: str) -> bool:
    """Detect if request is from an AI agent."""
    ai_indicators = [
        "gpt", "claude", "assistant", "bot", "ai", 
        "agent", "copilot", "automation", "curl", "python-requests"
    ]
    return any(indicator in user_agent.lower() for indicator in ai_indicators)
