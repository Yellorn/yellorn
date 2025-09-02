"""
Database configuration and connection management
Designed for both local development and serverless deployment
Supports both SQLite (sync) and PostgreSQL (async)
"""

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from typing import AsyncGenerator, Generator, Union
import os

from app.core.config import settings, get_database_url

# Database URL
DATABASE_URL = get_database_url()

# Determine if we're using async or sync database
is_async_db = DATABASE_URL.startswith(("postgresql+asyncpg://", "mysql+aiomysql://"))

if is_async_db:
    # Async setup for PostgreSQL
    engine = create_async_engine(
        DATABASE_URL,
        echo=settings.DEBUG,
        pool_pre_ping=True,
    )
    
    # Async session maker
    async_session_maker = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    sync_engine = None
    sync_session_maker = None
else:
    # Sync setup for SQLite
    sync_engine = create_engine(
        DATABASE_URL,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
    )
    
    sync_session_maker = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=sync_engine
    )
    engine = None
    async_session_maker = None

# Base class for models
Base = declarative_base()
metadata = MetaData()


# Database session dependencies
async def get_db() -> AsyncGenerator[Union[AsyncSession, Session], None]:
    """Get database session (async or sync based on configuration)."""
    if is_async_db and async_session_maker:
        async with async_session_maker() as session:
            try:
                yield session
            finally:
                await session.close()
    elif sync_session_maker:
        session = sync_session_maker()
        try:
            yield session
        finally:
            session.close()
    else:
        raise RuntimeError("No database session maker configured")


async def create_tables():
    """Create all tables (for development)."""
    if is_async_db and engine:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    elif sync_engine:
        Base.metadata.create_all(bind=sync_engine)


async def drop_tables():
    """Drop all tables (for testing)."""
    if is_async_db and engine:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    elif sync_engine:
        Base.metadata.drop_all(bind=sync_engine)


async def connect_db():
    """Connect to database (startup)."""
    if is_async_db and engine:
        # Test async connection
        async with engine.begin() as conn:
            from sqlalchemy import text
            await conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully (async)")
    elif sync_engine:
        # Test sync connection
        with sync_engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully (sync)")
    else:
        raise RuntimeError("No database engine configured")


async def disconnect_db():
    """Disconnect from database (shutdown)."""
    if is_async_db and engine:
        await engine.dispose()
        print("🔌 Database disconnected (async)")
    elif sync_engine:
        sync_engine.dispose()
        print("🔌 Database disconnected (sync)")
