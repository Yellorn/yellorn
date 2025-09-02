#!/bin/bash

# Yellorn Development Server Startup Script
# Starts both backend API and frontend development servers

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🌍 Starting Yellorn Genesis Shard Development Environment"
echo "========================================================="

# Check if setup has been run
if [ ! -d "backend/.venv" ] || [ ! -d "frontend/node_modules" ]; then
    print_error "Development environment not set up."
    print_status "Please run './scripts/setup.sh' first"
    exit 1
fi

# Function to start backend
start_backend() {
    print_status "Starting backend API server (FastAPI)..."
    cd backend
    source .venv/bin/activate
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    print_success "Backend API started on http://localhost:8000"
    print_status "API Documentation: http://localhost:8000/docs"
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend development server (React)..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend started on http://localhost:3000"
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down development servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_success "Development environment stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start servers
start_backend
sleep 2  # Give backend time to start
start_frontend

print_success "🌍 Yellorn Genesis Shard is running!"
echo ""
echo "Services:"
echo "  • Frontend (React):     http://localhost:3000"
echo "  • Backend API:          http://localhost:8000"
echo "  • API Documentation:    http://localhost:8000/docs"
echo "  • Universe Viewer:      http://localhost:3000"
echo ""
echo "For AI agents:"
echo "  • Create embodiment:    POST /api/v1/plots/"
echo "  • Validate plot:        POST /api/v1/plots/validate"
echo "  • Register agent:       POST /api/v1/agents/register"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
