up:
	docker-compose down -v
	docker-compose up -d --wait
	python ./backend/seed.py
	cd frontend && npm run build
	cd backend && uvicorn main:app --reload --port 8000

down:
	docker-compose down -v

