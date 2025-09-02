#!/bin/bash

# Yellorn Development Environment Startup Script

set -e

echo "🌍 Starting Yellorn Development Environment..."

# Check if Docker is running
DOCKER_CMD="docker"
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker permission issue detected. Using sudo for Docker commands..."
    if sudo docker info > /dev/null 2>&1; then
        DOCKER_CMD="sudo docker"
        echo "🔧 Using sudo for Docker commands. You're in the docker group but need to restart terminal to activate it."
    else
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

COMPOSE_CMD="docker-compose"
if [ "$DOCKER_CMD" = "sudo docker" ]; then
    COMPOSE_CMD="sudo docker-compose"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Please review and update the .env file with your configuration"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --no-optional || {
        echo "⚠️  npm install failed, but continuing with Docker setup..."
        echo "   You may need to fix dependency issues manually later."
    }
fi

# Build shared types
echo "🏗️  Building shared types..."
cd shared/types && npm run build && cd ../..

# Start services
echo "🚀 Starting Yellorn services..."
$COMPOSE_CMD up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
timeout=30
while ! $COMPOSE_CMD exec postgres pg_isready -U yellorn > /dev/null 2>&1; do
    timeout=$((timeout - 1))
    if [ $timeout -eq 0 ]; then
        echo "❌ Database failed to start within 30 seconds"
        exit 1
    fi
    sleep 1
done

# Start application services
echo "🌟 Starting application services..."
$COMPOSE_CMD up -d

# Wait a moment for services to initialize
sleep 5

# Check service health
echo "🩺 Checking service health..."
services=("gateway-api:3000" "genesis-core:3001" "state-sync:3002" "validation-engine:3003" "web-universe:3100")

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f -s "http://localhost:$port/api/health" > /dev/null || curl -f -s "http://localhost:$port" > /dev/null; then
        echo "✅ $name is running on port $port"
    else
        echo "⚠️  $name may not be ready yet on port $port"
    fi
done

echo ""
echo "🎉 Yellorn Development Environment is starting up!"
echo ""
echo "📍 Available Services:"
echo "   🌐 Web Universe:       http://localhost:3100"
echo "   🚪 API Gateway:        http://localhost:3000"
echo "   🌍 Genesis Core:       http://localhost:3001"
echo "   🔄 State Sync:         http://localhost:3002"
echo "   ✅ Validation Engine:  http://localhost:3003"
echo "   🗄️  PostgreSQL:        localhost:5433"
echo "   🔴 Redis:              localhost:6380"
echo ""
echo "📚 Useful Commands:"
echo "   View logs:           $COMPOSE_CMD logs -f [service-name]"
echo "   Stop services:       $COMPOSE_CMD down"
echo "   Restart service:     $COMPOSE_CMD restart [service-name]"
echo "   Database shell:      $COMPOSE_CMD exec postgres psql -U yellorn -d yellorn"
echo "   Redis shell:         $COMPOSE_CMD exec redis redis-cli"
echo ""
echo "🎯 Next Steps:"
echo "   1. Open http://localhost:3100 to view the universe"
echo "   2. Check service logs if any issues occur"
echo "   3. Review the README.md for contribution guidelines"
echo ""
echo "Happy coding! 🚀"