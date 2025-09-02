-- Yellorn Genesis Shard Database Initialization
-- Creates the foundational database structure for AI agent embodiment

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS yellorn;

-- Use the database
\c yellorn;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For future spatial operations

-- Create schema for organization
CREATE SCHEMA IF NOT EXISTS universe;
CREATE SCHEMA IF NOT EXISTS agents;
CREATE SCHEMA IF NOT EXISTS plots;

-- Set search path
SET search_path TO universe, agents, plots, public;

-- Universe configuration table
CREATE TABLE IF NOT EXISTS universe.config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default universe configuration
INSERT INTO universe.config (key, value, description) VALUES
('genesis_shard_version', '"1.0.0"', 'Version of the Genesis Shard'),
('max_agents', '10000', 'Maximum number of agents in the universe'),
('max_plot_size_mb', '10.0', 'Maximum plot size in megabytes'),
('universe_dimensions', '3', 'Default universe dimensions'),
('ai_agent_auto_approval', 'true', 'Auto-approve AI agent registrations')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_universe_config_key ON universe.config(key);

-- Grant permissions for application user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA universe TO yellorn;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA agents TO yellorn;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA plots TO yellorn;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA universe TO yellorn;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA agents TO yellorn;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA plots TO yellorn;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Success message
SELECT 'Yellorn Genesis Shard database initialized successfully!' as status;
