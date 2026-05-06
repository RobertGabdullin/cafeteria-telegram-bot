.PHONY: up down add-admin

up:
	docker-compose down -v
	docker-compose up -d --wait
	sleep 2
	python ./backend/seed.py
	cd frontend && npm run build
	cd backend && uvicorn main:app --reload --port 8000

down:
	docker-compose down -v

add-admin:
	cd backend && python add_admin.py --login=$(LOGIN)
