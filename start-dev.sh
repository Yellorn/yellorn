#!/bin/bash

# Yellorn Development Server Startup Script
# Starts backend API server (frontend will be rebuilt with Vite)

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

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    local service_name=$2
    
    print_status "Checking for existing processes on port $port ($service_name)..."
    
    # Kill any process using the port
    if fuser -k ${port}/tcp 2>/dev/null; then
        print_status "Killed existing process on port $port"
        sleep 1
    fi
    
    # Also kill by process name patterns for extra safety
    if [ "$service_name" = "backend" ]; then
        pkill -f "uvicorn.*main:app" 2>/dev/null || true
        pkill -f "python.*main.py" 2>/dev/null || true
    fi
}

echo "🌍 Starting Yellorn Genesis Shard Development Environment"
echo "========================================================="

# Clean up any existing processes first
print_status "Cleaning up any existing development processes..."
kill_port_processes 8000 "backend"

# Check if setup has been run
if [ ! -d "backend/.venv" ]; then
    print_error "Backend development environment not set up."
    print_status "Please set up the backend first"
    exit 1
fi

# Function to start backend
start_backend() {
    print_status "Starting backend API server (FastAPI)..."
    kill_port_processes 8000 "backend"
    cd backend
    source .venv/bin/activate
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    print_success "Backend API started on http://localhost:8000"
    print_status "API Documentation: http://localhost:8000/docs"
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down development servers..."
    
    # Kill specific PIDs if we have them
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    # Also clean up ports to be extra sure
    kill_port_processes 8000 "backend"
    
    print_success "Development environment stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start servers
start_backend

print_success "🌍 Yellorn Genesis Shard Backend is running!"
echo ""
echo "Services:"
echo "  • Backend API:          http://localhost:8000"
echo "  • API Documentation:    http://localhost:8000/docs"
echo ""
echo "For AI agents:"
echo "  • Create embodiment:    POST /api/v1/plots/"
echo "  • Validate plot:        POST /api/v1/plots/validate"
echo "  • Register agent:       POST /api/v1/agents/register"
echo ""
echo "Note: Frontend will be rebuilt with Vite"
echo "Press Ctrl+C to stop the backend service"

# Wait for user to stop
wait
