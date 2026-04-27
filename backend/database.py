from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, Date, JSON, Integer, DateTime, ForeignKey

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5439/cafeteria"

engine = create_async_engine(DATABASE_URL)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Menu(Base):
    __tablename__ = "menus"

    namespace = Column(String, primary_key=True)
    date = Column(Date, primary_key=True)
    menu_json = Column(JSON, nullable=False)


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, autoincrement=True)
    login = Column(String(64), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Session(Base):
    __tablename__ = "sessions"

    token = Column(String(64), primary_key=True)
    admin_id = Column(Integer, ForeignKey("admins.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)