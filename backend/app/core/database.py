"""
Database configuration removed - Using JSON files for simplicity
"""

from typing import AsyncGenerator, Union


async def get_db() -> AsyncGenerator[Union[None, None], None]:
    """Placeholder database session - not used with JSON file approach."""
    yield None


async def connect_db():
    """Placeholder connect function - not needed with JSON files."""
    print("📁 Using JSON file storage (no database connection needed)")


async def disconnect_db():
    """Placeholder disconnect function - not needed with JSON files."""
    print("📁 JSON file storage (no database disconnection needed)")


async def create_tables():
    """Placeholder create tables function - not needed with JSON files."""
    pass
