# -*- coding: utf-8 -*-
from pathlib import Path
from dotenv import load_dotenv
import os
from typing import Optional
from datetime import timedelta

# Загружаем .env из корневой директории (для локальной разработки)
# При сборке через docker-compose .env будет в том же месте, что и docker-compose.yaml
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)


class Settings:
    """Конфигурация приложения."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5439/cafeteria"
    )

    # Session settings
    SESSION_COOKIE_NAME: str = os.getenv("SESSION_COOKIE_NAME", "session")
    SESSION_DURATION: timedelta = timedelta(
        days=int(os.getenv("SESSION_DURATION_DAYS", "30"))
    )

    # Security
    SECRET_KEY: Optional[str] = os.getenv("SECRET_KEY")  # Для будущих JWT/шифрования

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Environment
    ENV: str = os.getenv("ENV", "development")  # development, production
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # CORS (для будущего использования)
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")

    # SSL/TLS для cookie (только для production)
    SECURE_COOKIES: bool = os.getenv("SECURE_COOKIES", "false").lower() == "true"

    # LLM settings
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_API_URL: str = os.getenv("LLM_API_URL", "https://api.proxyapi.ru/openai/v1/chat/completions")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-5.4-mini")


# Глобальный экземпляр настроек
settings = Settings()
