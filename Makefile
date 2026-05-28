.PHONY: up down add-admin build build-backend build-frontend seed logs dev backend-local frontend-local

# Запуск всего проекта в Docker
up:
	docker-compose down -v
	docker-compose up -d --wait
	docker-compose exec -T backend python backend/seed.py

up-local:
	docker-compose down -v
	docker-compose up db -d --wait
	python ./backend/seed.py
	cd frontend && npm run build
	cd backend && uvicorn main:app --reload --port 8000

# Остановка и очистка
down:
	docker-compose down -v

# Добавление админа
add-admin:
	docker-compose exec -T backend python backend/add_admin.py --login=$(LOGIN)

# Сборка всех образов
build:
	docker-compose build

# Сборка бекенда
build-backend:
	docker-compose build backend

# Сборка фронтенда
build-frontend:
	cd frontend && npm run build

# Сидирование базы данных
seed:
	docker-compose exec -T backend python backend/seed.py

# Просмотр логов
logs:
	docker-compose logs -f

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
