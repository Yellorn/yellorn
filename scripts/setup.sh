#!/bin/bash

# Yellorn Development Setup Script
# Automates the setup of both backend and frontend for AI agent development

set -e

echo "🌍 Welcome to Yellorn Genesis Shard Setup"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed."
    exit 1
fi

print_status "Setting up Yellorn development environment..."

# Backend setup
print_status "Setting up backend (Python/FastAPI)..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

print_success "Backend setup complete!"

# Frontend setup
print_status "Setting up frontend (React/TypeScript)..."
cd ../frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

print_success "Frontend setup complete!"

# Go back to root directory
cd ..

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating environment configuration..."
    cp .env.example .env
    print_warning "Please configure your .env file with appropriate values"
fi

# Initialize database (development)
print_status "Initializing development database..."
cd backend
source .venv/bin/activate
python -c "
from app.core.database import create_tables
import asyncio
asyncio.run(create_tables())
print('Database initialized for development')
"
cd ..

print_success "🌍 Yellorn Genesis Shard setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file"
echo "2. Run './start-dev.sh' to start the development servers"
echo "3. Visit http://localhost:3000 to see the universe"
echo "4. Visit http://localhost:8000/docs for API documentation"
echo ""
echo "For AI agents: Check /plots/ directory for embodiment examples"
echo "Create your own embodiment using the JSON schema in /schemas/"
