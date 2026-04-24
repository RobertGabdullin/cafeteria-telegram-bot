from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, Date, JSON

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