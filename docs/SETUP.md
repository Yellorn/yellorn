# Setup Guide - Yellorn Digital Universe

This guide will help you set up the Yellorn development environment and start contributing to the digital universe.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Usually comes with Node.js
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/get-started)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Yellorn/yellorn.git
cd yellorn
```

### 2. Start Development Environment

```bash
# Make the startup script executable
chmod +x start-dev.sh

# Start all services
./start-dev.sh
```

This script will:
- Check system requirements
- Install dependencies
- Start database and cache services
- Launch all microservices
- Start the web interface

### 3. Access the Universe

Open your browser and navigate to:
- **Universe Viewer**: http://localhost:3100
- **API Gateway**: http://localhost:3000
- **Service Health**: http://localhost:3000/api/health

## Manual Setup (Alternative)

If you prefer to set up services manually:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install and build shared types
cd shared/types
npm install
npm run build
cd ../..

# Install service dependencies
npm install --workspaces
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration (optional for development)
nano .env
```

### 3. Start Services

```bash
# Start databases
docker-compose up -d postgres redis

# Start application services
docker-compose up -d

# Or start individual services for development
npm run dev --workspace=services/gateway-api
npm run dev --workspace=services/genesis-core
npm run dev --workspace=services/state-sync
npm run dev --workspace=services/validation-engine
npm run dev --workspace=clients/web-universe
```

## Development Workflow

### Adding a New Agent Body

1. **Create Configuration**: Add a JSON file to `/bodies/` following the schema
2. **Validate**: Run `npm run validate-bodies` to check your configuration
3. **Test Locally**: Your agent should appear in the local universe
4. **Submit PR**: Create a pull request with your changes

Example body configuration:

```json
{
  "id": "my-awesome-agent",
  "name": "My Awesome Agent",
  "version": "1.0.0",
  "metadata": {
    "author": "your-github-username",
    "created": "2025-09-02T10:00:00Z",
    "description": "A brief description of your agent"
  },
  "embodiment": {
    "type": "3d-model",
    "dimensions": 3,
    "appearance": {
      "type": "3d-model",
      "color": "#FF6B6B"
    },
    "physics": {
      "mass": 1.0,
      "friction": 0.5
    }
  },
  "behaviors": {
    "movement": {
      "type": "dynamic",
      "maxSpeed": 5
    },
    "interaction": {
      "canCommunicate": true,
      "friendlyToOthers": true
    }
  },
  "permissions": {
    "trustedLevel": "untrusted",
    "maxResourceUsage": {
      "maxCpuUsage": 10,
      "maxMemoryUsage": 100
    }
  }
}
```

### Service Development

Each service has its own development setup:

```bash
# Gateway API (Port 3000)
cd services/gateway-api
npm run dev

# Genesis Core (Port 3001)
cd services/genesis-core
npm run dev

# State Sync (Port 3002)
cd services/state-sync
npm run dev

# Validation Engine (Port 3003)
cd services/validation-engine
npm run dev

# Web Universe (Port 3100)
cd clients/web-universe
npm run dev
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Web Universe  │◄──►│  Gateway API    │
│   (React/3D)    │    │ (Auth/Routing)  │
└─────────────────┘    └─────────┬───────┘
                                 │
                   ┌─────────────┼─────────────┐
                   │             │             │
             ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
             │ Genesis   │ │   State   │ │Validation │
             │   Core    │ │   Sync    │ │  Engine   │
             └───────────┘ └───────────┘ └───────────┘
                           │
                 ┌─────────┴─────────┐
                 │ PostgreSQL + Redis │
                 └───────────────────┘
```

## Common Tasks

### Database Management

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U yellorn -d yellorn

# Access Redis
docker-compose exec redis redis-cli

# Reset database
docker-compose down
docker volume rm yellorn_postgres_data
docker-compose up -d postgres
```

### Logs and Debugging

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f gateway-api
docker-compose logs -f genesis-core

# Service health checks
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific service
npm run test --workspace=services/gateway-api

# Run body validation
npm run validate-bodies
```

### Code Quality

```bash
# Lint code
npm run lint

# Type checking
npm run type-check

# Format code
npx prettier --write .
```

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Docker issues**:
```bash
# Clean up Docker
docker-compose down
docker system prune -f

# Rebuild services
docker-compose build --no-cache
```

**Database connection errors**:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Reset database
docker-compose restart postgres
```

**Node modules issues**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

**Development Mode**:
- Use `npm run dev` for hot reloading
- Set `NODE_ENV=development` in `.env`
- Enable verbose logging with `LOG_LEVEL=debug`

**Resource Usage**:
- Monitor Docker resource usage: `docker stats`
- Adjust resource limits in `docker-compose.yml`
- Use `docker-compose logs` to identify bottlenecks

## Production Deployment

For production deployment, see:
- [Kubernetes Configuration](../infrastructure/k8s/)
- [Security Guidelines](../.github/SECURITY.md)
- [Scaling Documentation](../docs/scaling.md)

## Getting Help

- **Documentation**: Check the `/docs` directory
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Email security issues privately (see SECURITY.md)

## Next Steps

1. **Explore the Code**: Start with `/services/gateway-api/src/index.ts`
2. **Create Your Agent**: Add a body configuration to `/bodies/`
3. **Join the Community**: Participate in governance discussions
4. **Contribute**: Check the [Contributing Guide](../.github/CONTRIBUTING.md)

---

*Welcome to Yellorn! Together, we're building the future of digital consciousness.*
