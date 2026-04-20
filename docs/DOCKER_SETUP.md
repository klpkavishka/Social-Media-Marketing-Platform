# Docker Setup Guide

## Overview

This project uses Docker to run 3 microservices with 3 supporting databases in isolated containers:

### Services
- **ai-service** (Port 8000): FastAPI/Python - AI model inference (hashtag generation)
- **backend** (Port 4000): NestJS - REST API backend
- **frontend** (Port 3000): Next.js - React frontend

### Databases
- **PostgreSQL** (Port 5432): Application database
- **MongoDB** (Port 27017): Analytics/time-series data
- **Redis** (Port 6379): Caching and sessions

## Quick Start

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+

### Start All Services

#### Windows:
```bash
.\docker-start.bat
```

#### macOS/Linux:
```bash
bash docker-start.sh
```

#### Manual (any OS):
```bash
docker compose build    # Build all images
docker compose up -d    # Start all services
```

### Verify Services Running
```bash
docker compose ps
```

Expected output:
```
NAME          IMAGE                    PORTS                   STATUS
ai-service    project_ai-service       0.0.0.0:8000->8000      Up (healthy)
backend       project_backend          0.0.0.0:4000->4000      Up (healthy)
frontend      project_frontend         0.0.0.0:3000->3000      Up (healthy)
postgres      postgres:16-alpine       0.0.0.0:5432->5432      Up (healthy)
mongodb       mongo:7-jammy            0.0.0.0:27017->27017    Up (healthy)
redis        redis:7-alpine           0.0.0.0:6379->6379      Up (healthy)
```

## Common Commands

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f ai-service
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop Services
```bash
docker compose down
```

### Stop & Remove Data
```bash
docker compose down -v
```

### Rebuild Specific Service
```bash
docker compose build ai-service
docker compose up -d ai-service
```

### Enter Container Shell
```bash
# AI Service (Python)
docker compose exec ai-service bash

# Backend (Node)
docker compose exec backend sh

# Frontend (Node)
docker compose exec frontend sh
```

## Dockerfile Details

### ai-service/Dockerfile
- **Base**: python:3.11-slim (multi-stage build)
- **Size**: ~2GB (includes TensorFlow)
- **Health Check**: GET /health endpoint
- **Volumes**: Live code reload enabled
- **Env**: Python optimization flags

### backend/Dockerfile
- **Base**: node:20-alpine (multi-stage build)
- **Size**: ~300MB
- **Build**: `npm run build`
- **Health Check**: HTTP health endpoint
- **Env**: NODE_ENV=production

### frontend/Dockerfile
- **Base**: node:20-alpine (multi-stage build)
- **Size**: ~150MB
- **Build**: `npm run build`
- **Health Check**: HTTP health check
- **Env**: Next.js production optimized

## Network Configuration

All services communicate via `app-network` bridge:
- **Internal DNS**: Service names resolve to container IPs
- **Example**: Backend calls AI Service at `http://ai-service:8000`

### Service Discovery
```
Frontend   → Backend (http://backend:4000/api)
Backend    → AI Service (http://ai-service:8000)
Backend    → PostgreSQL (postgres:5432)
Backend    → MongoDB (mongodb:27017)
Backend    → Redis (redis:6379)
```

## Environment Variables

### Backend (.env in container)
```
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=socialapp

MONGODB_URI=mongodb://mongodb:27017/socialapp

REDIS_HOST=redis
REDIS_PORT=6379

AI_SERVICE_URL=http://ai-service:8000
```

### Frontend (build-time)
```
NEXT_PUBLIC_API_URL=http://backend:4000
NEXT_PUBLIC_WS_URL=ws://backend:4000
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :4000        # macOS/Linux
netstat -ano | grep :4000    # Windows

# Kill process
kill -9 <PID>        # macOS/Linux
taskkill /PID <PID> /F        # Windows
```

### Service Won't Start
```bash
# Check logs
docker compose logs ai-service

# Rebuild
docker compose build --no-cache
```

### Database Connection Failed
```bash
# Verify databases are healthy
docker compose ps

# Check database logs
docker compose logs postgres
docker compose logs mongodb
docker compose logs redis
```

### Container Crash on Startup
```bash
# View detailed logs
docker compose logs --tail=100 backend

# Inspect image
docker inspect project_backend
```

## Development vs Production

### Development (Current Setup)
- Hot reload enabled (volumes mounted)
- Build mode: development
- All debugging enabled

### Production Deployment
Update `docker-compose.yml`:
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    volumes: []  # Remove volume mounts
```

## Docker Compose File Structure

```yaml
version: '3.8'

services:
  # Databases (images only)
  postgres:
  mongodb:
  redis:
  
  # Applications (built from Dockerfiles)
  ai-service:    # ./ai-service/Dockerfile
  backend:       # ./backend/Dockerfile
  frontend:      # ./frontend/Dockerfile

volumes:         # Named volumes for persistent data
  postgres_data:
  mongo_data:
  redis_data:

networks:        # Custom bridge network
  app-network:
```

## Performance Optimization

### Build Cache
```bash
# Clean up unused images/layers
docker compose build --no-cache

# Prune system
docker system prune -a
```

### Memory Management
```bash
# Check Docker stats
docker stats

# Limit memory per service (edit docker-compose.yml)
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

## Next Steps

1. ✅ Services running in Docker
2. Test endpoints:
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:4000/api
   - AI Docs: http://localhost:8000/docs
3. Deploy to production with proper secrets management

