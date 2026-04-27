from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import Admin
from auth import (
    get_db,
    get_current_admin,
    verify_password,
    create_session,
    delete_session,
    set_session_cookie,
    clear_session_cookie,
    SESSION_COOKIE_NAME,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    login: str
    password: str


class UserResponse(BaseModel):
    id: int
    login: str


@router.post("/login", response_model=UserResponse)
async def login(
    data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Admin).where(Admin.login == data.login))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    token = await create_session(db, admin.id)
    set_session_cookie(response, token)

    return UserResponse(id=admin.id, login=admin.login)


@router.post("/logout")
async def logout(
    response: Response,
    session: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
):
    if session:
        await delete_session(db, session)
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=UserResponse)
async def me(admin: Admin = Depends(get_current_admin)):
    return UserResponse(id=admin.id, login=admin.login)