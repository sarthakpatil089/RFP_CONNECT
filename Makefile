.PHONY: help dev dev-up dev-down dev-logs dev-build dev-clean install backend-install frontend-install

help:
    @echo "Available commands:"
    @echo "  make dev              - Start all services (docker-compose up)"
    @echo "  make dev-up           - Start services in background"
    @echo "  make dev-down         - Stop all services"
    @echo "  make dev-logs         - View logs from all services"
    @echo "  make dev-build        - Rebuild Docker images"
    @echo "  make dev-clean        - Remove volumes and containers"
    @echo "  make install          - Install dependencies for backend and frontend"
    @echo "  make backend-install  - Install backend dependencies only"
    @echo "  make frontend-install - Install frontend dependencies only"

dev:
    docker-compose up

dev-up:
    docker-compose up -d

dev-down:
    docker-compose down

dev-logs:
    docker-compose logs -f

dev-build:
    docker-compose build --no-cache

dev-clean:
    docker-compose down -v
    rm -rf backend/node_modules frontend/node_modules

install: backend-install frontend-install
    @echo "✅ All dependencies installed"

backend-install:
    cd backend && npm install

frontend-install:
    cd frontend && npm install

ps:
    docker-compose ps

shell-backend:
    docker-compose exec backend sh

shell-frontend:
    docker-compose exec frontend sh

db-shell:
    docker-compose exec db psql -U postgres -d ai_powered_rfp_db

redis-cli:
    docker-compose exec redis redis-cli