#!/bin/bash

# Yellorn Frontend Deployment Script
# Supports multiple deployment targets: Vercel, Netlify, Docker, and manual

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

# Check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "Dependencies checked"
}

# Install packages
install_packages() {
    print_status "Installing packages..."
    cd frontend
    npm ci
    cd ..
    print_success "Packages installed"
}

# Build the application
build_app() {
    print_status "Building application..."
    cd frontend
    
    # Type check
    npm run type-check
    
    # Lint
    npm run lint
    
    # Build
    npm run build:prod
    
    cd ..
    print_success "Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd frontend
    vercel --prod
    cd ..
    
    print_success "Deployed to Vercel"
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    cd frontend
    netlify deploy --prod --dir=dist
    cd ..
    
    print_success "Deployed to Netlify"
}

# Build Docker image
build_docker() {
    print_status "Building Docker image..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker"
        exit 1
    fi
    
    # Build frontend image
    docker build -t yellorn/frontend:latest ./frontend
    
    print_success "Docker image built: yellorn/frontend:latest"
}

# Deploy with Docker Compose
deploy_docker() {
    print_status "Deploying with Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose"
        exit 1
    fi
    
    # Build and start services
    docker-compose -f docker-compose.frontend.yml up -d --build
    
    print_success "Deployed with Docker Compose"
    print_status "Frontend available at: http://localhost:3000"
    print_status "Backend API available at: http://localhost:8000"
}

# Manual deployment (build only)
manual_deploy() {
    print_status "Preparing manual deployment..."
    
    build_app
    
    print_success "Manual deployment ready"
    print_status "Upload the contents of frontend/dist/ to your web server"
    print_status "Set environment variable VITE_API_URL to your API endpoint"
}

# Show help
show_help() {
    echo "Yellorn Frontend Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS] [TARGET]"
    echo ""
    echo "Targets:"
    echo "  vercel      Deploy to Vercel (serverless)"
    echo "  netlify     Deploy to Netlify (serverless)"
    echo "  docker      Build Docker image only"
    echo "  compose     Deploy with Docker Compose (full stack)"
    echo "  manual      Build for manual deployment"
    echo "  help        Show this help message"
    echo ""
    echo "Options:"
    echo "  --skip-deps Skip dependency check"
    echo "  --skip-build Skip build step"
    echo "  --production Use production settings"
    echo ""
    echo "Examples:"
    echo "  $0 vercel"
    echo "  $0 docker --production"
    echo "  $0 manual --skip-deps"
}

# Parse arguments
SKIP_DEPS=false
SKIP_BUILD=false
PRODUCTION=false
TARGET=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --production)
            PRODUCTION=true
            shift
            ;;
        help)
            show_help
            exit 0
            ;;
        vercel|netlify|docker|compose|manual)
            TARGET=$1
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main deployment logic
main() {
    print_status "Starting Yellorn Frontend deployment..."
    print_status "Target: $TARGET"
    
    # Check if in correct directory
    if [[ ! -f "frontend/package.json" ]]; then
        print_error "Please run this script from the Yellorn project root directory"
        exit 1
    fi
    
    # Check dependencies
    if [[ "$SKIP_DEPS" == false ]]; then
        check_dependencies
        install_packages
    fi
    
    # Build application
    if [[ "$SKIP_BUILD" == false ]] && [[ "$TARGET" != "docker" ]] && [[ "$TARGET" != "compose" ]]; then
        build_app
    fi
    
    # Deploy based on target
    case $TARGET in
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        docker)
            build_docker
            ;;
        compose)
            deploy_docker
            ;;
        manual)
            manual_deploy
            ;;
        "")
            print_error "No deployment target specified"
            show_help
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
}

# Run main function
main
