# -*- coding: utf-8 -*-
import os
from typing import Optional
from datetime import timedelta


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


# Глобальный экземпляр настроек
settings = Settings()
