#!/bin/bash

# Yellorn Development Server Startup Script
# Starts both backend API server and frontend development server

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

print_frontend() {
    echo -e "${PURPLE}[FRONTEND]${NC} $1"
}

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    local service_name=$2
    
    print_status "Checking for existing processes on port $port ($service_name)..."
    
    # Kill any process using the port
    if command -v fuser >/dev/null 2>&1; then
        if fuser -k ${port}/tcp 2>/dev/null; then
            print_status "Killed existing process on port $port"
            sleep 1
        fi
    else
        # Alternative method using lsof if fuser is not available
        local pid=$(lsof -t -i:$port 2>/dev/null || true)
        if [ ! -z "$pid" ]; then
            kill $pid 2>/dev/null || true
            print_status "Killed existing process $pid on port $port"
            sleep 1
        fi
    fi
    
    # Also kill by process name patterns for extra safety
    if [ "$service_name" = "backend" ]; then
        pkill -f "uvicorn.*main:app" 2>/dev/null || true
        pkill -f "python.*main.py" 2>/dev/null || true
    elif [ "$service_name" = "frontend" ]; then
        pkill -f "vite" 2>/dev/null || true
        pkill -f "npm.*dev" 2>/dev/null || true
    fi
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm >/dev/null 2>&1; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Python virtual environment
    if [ ! -f ".venv/bin/python" ]; then
        print_error "Python virtual environment not found. Please run setup.sh first"
        exit 1
    fi
    
    print_success "Dependencies checked"
}

echo "🌍 Starting Yellorn Genesis Shard Development Environment"
echo "========================================================="

# Check dependencies first
check_dependencies

# Clean up any existing processes first
print_status "Cleaning up any existing development processes..."
kill_port_processes 8000 "backend"
kill_port_processes 3000 "frontend"
kill_port_processes 3001 "frontend"
kill_port_processes 3002 "frontend"

# Check if backend setup has been run
if [ ! -d ".venv" ]; then
    print_error "Backend development environment not set up."
    print_status "Please run: python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt"
    exit 1
fi

# Check if frontend setup has been run
if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not installed. Installing now..."
    cd frontend
    npm ci
    cd ..
    print_success "Frontend dependencies installed"
fi

# Function to start backend
start_backend() {
    print_status "Starting backend API server (FastAPI)..."
    
    cd backend
    # Start backend in background
    ../.venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 > /tmp/yellorn-backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Check if backend is running
    if curl -s http://localhost:8000/api/v1/health/ >/dev/null 2>&1; then
        print_success "Backend API started on http://localhost:8000"
        print_status "API Documentation: http://localhost:8000/docs"
    else
        print_error "Backend failed to start. Check logs: tail -f /tmp/yellorn-backend.log"
        exit 1
    fi
}

# Function to start frontend
start_frontend() {
    print_frontend "Starting frontend development server (Vite + React)..."
    
    cd frontend
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
        print_status "Created frontend .env file"
    fi
    
    # Start frontend in background
    npm run dev > /tmp/yellorn-frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Wait a moment for frontend to start
    sleep 5
    
    # Check which port frontend is using by checking the log
    local frontend_url=""
    if grep -q "Local:.*http://localhost:3000" /tmp/yellorn-frontend.log 2>/dev/null; then
        frontend_url="http://localhost:3000"
    elif grep -q "Local:.*http://localhost:3001" /tmp/yellorn-frontend.log 2>/dev/null; then
        frontend_url="http://localhost:3001"
    elif grep -q "Local:.*http://localhost:3002" /tmp/yellorn-frontend.log 2>/dev/null; then
        frontend_url="http://localhost:3002"
    else
        frontend_url="http://localhost:3000"
    fi
    
    # Check if frontend is running
    if curl -s $frontend_url >/dev/null 2>&1; then
        print_success "Frontend started on $frontend_url"
        FRONTEND_URL=$frontend_url
    else
        print_error "Frontend failed to start. Check logs: tail -f /tmp/yellorn-frontend.log"
        exit 1
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down development servers..."
    
    # Kill specific PIDs if we have them
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Also clean up ports to be extra sure
    kill_port_processes 8000 "backend"
    kill_port_processes 3000 "frontend"
    kill_port_processes 3001 "frontend"
    kill_port_processes 3002 "frontend"
    
    # Clean up log files
    rm -f /tmp/yellorn-backend.log /tmp/yellorn-frontend.log
    
    print_success "Development environment stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM EXIT

# Start servers in order
start_backend
start_frontend

print_success "🌍 Yellorn Genesis Shard Development Environment is running!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Services:"
echo "  • Frontend Web App:     ${FRONTEND_URL:-http://localhost:3000}"
echo "  • Backend API:          http://localhost:8000"
echo "  • API Documentation:    http://localhost:8000/docs"
echo ""
echo "🎮 For AI agents:"
echo "  • Create embodiment:    POST /api/v1/plots/"
echo "  • Validate plot:        POST /api/v1/plots/validate"
echo "  • Register agent:       POST /api/v1/agents/register"
echo ""
echo "📊 Current AI Agents:"
# Show current agents
if command -v jq >/dev/null 2>&1; then
    curl -s http://localhost:8000/api/v1/plots/ | jq -r '.[] | "  • \(.name) (\(.agent_id)) - \(.status)"' 2>/dev/null || echo "  • Check API for current agents"
else
    echo "  • Check http://localhost:8000/api/v1/plots/ for current agents"
fi
echo ""
echo "📝 Logs:"
echo "  • Backend:  tail -f /tmp/yellorn-backend.log"
echo "  • Frontend: tail -f /tmp/yellorn-frontend.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
