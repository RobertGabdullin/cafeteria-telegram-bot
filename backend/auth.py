import secrets
from datetime import datetime, timedelta
from typing import Optional

import bcrypt
from fastapi import Cookie, Depends, HTTPException, Response
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from database import async_session, Admin, Session

SESSION_COOKIE_NAME = "session"
SESSION_DURATION = timedelta(days=30)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def generate_token() -> str:
    return secrets.token_urlsafe(48)


async def get_db():
    async with async_session() as session:
        yield session


async def create_session(db: AsyncSession, admin_id: int) -> str:
    token = generate_token()
    expires_at = datetime.utcnow() + SESSION_DURATION
    session = Session(token=token, admin_id=admin_id, expires_at=expires_at)
    db.add(session)
    await db.commit()
    return token


async def delete_session(db: AsyncSession, token: str) -> None:
    await db.execute(delete(Session).where(Session.token == token))
    await db.commit()


async def get_current_admin(
    session: Optional[str] = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> Admin:
    if not session:
        raise HTTPException(status_code=401, detail="Не авторизован")

    result = await db.execute(
        select(Session).where(Session.token == session)
    )
    session_row = result.scalar_one_or_none()

    if not session_row:
        raise HTTPException(status_code=401, detail="Сессия не найдена")

    if session_row.expires_at < datetime.utcnow():
        await delete_session(db, session)
        raise HTTPException(status_code=401, detail="Сессия истекла")

    result = await db.execute(
        select(Admin).where(Admin.id == session_row.admin_id)
    )
    admin = result.scalar_one_or_none()

    if not admin:
        raise HTTPException(status_code=401, detail="Админ не найден")

    return admin


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=int(SESSION_DURATION.total_seconds()),
        httponly=True,
        samesite="lax",
        secure=False,  # На проде с HTTPS → True
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=SESSION_COOKIE_NAME)