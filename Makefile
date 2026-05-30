.PHONY: up down add-admin build build-backend build-frontend seed logs dev backend-local frontend-local

# Авто-определение команды docker-compose (docker compose vs docker-compose)
DOCKER_COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")

# Запуск всего проекта в Docker
up:
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d --wait --build
	$(DOCKER_COMPOSE) exec -T backend python backend/seed.py

up-local:
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up db -d --wait
	python ./backend/seed.py
	cd frontend && npm run build
	cd backend && uvicorn main:app --reload --port 8000

# Остановка и очистка
down:
	$(DOCKER_COMPOSE) down -v

# Добавление админа
add-admin:
	$(DOCKER_COMPOSE) exec -T backend python backend/add_admin.py --login=$(LOGIN)

# Сборка всех образов
build:
	$(DOCKER_COMPOSE) build

# Сборка бекенда
build-backend:
	$(DOCKER_COMPOSE) build backend

# Сборка фронтенда
build-frontend:
	cd frontend && npm run build

# Сидирование базы данных
seed:
	$(DOCKER_COMPOSE) exec -T backend python backend/seed.py

# Просмотр логов
logs:
	$(DOCKER_COMPOSE) logs -f

# Запуск бекенда локально (для разработки)
backend-local:
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Запуск фронтенда локально (для разработки)
frontend-local:
	cd frontend && npm run dev

# Запуск бекенда и фронтенда локально
dev:
	@echo "Starting backend and frontend in development mode..."
	@cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
	@cd frontend && npm run dev
