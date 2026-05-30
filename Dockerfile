FROM python:3.12-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Установка Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Копирование зависимостей бекенда и установка
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода бекенда
COPY backend/ ./backend/

# Копирование .env файла
COPY .env .env

# Сборка фронтенда
# Копируем package files для установки зависимостей
COPY frontend/package.json frontend/package-lock.json* ./frontend/
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
# Копируем исходный код фронтенда
COPY frontend/ ./
# Собираем фронтенд
RUN npm run build
# Возвращаемся в корень приложения
WORKDIR /app

# Переменная окружения для Python (буферизация вывода)
ENV PYTHONUNBUFFERED=1

# Порт приложения
EXPOSE 8000

# Переменная окружения для PYTHONPATH
ENV PYTHONPATH=/app/backend

# Запуск приложения
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
