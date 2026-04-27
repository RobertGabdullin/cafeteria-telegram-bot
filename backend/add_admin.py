import argparse
import asyncio
import getpass

from sqlalchemy import select

from database import async_session, engine, Base, Admin
from auth import hash_password


async def add_admin(login: str, password: str) -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        existing = await session.execute(select(Admin).where(Admin.login == login))
        if existing.scalar_one_or_none():
            print(f"❌ Админ '{login}' уже существует")
            return

        admin = Admin(login=login, password_hash=hash_password(password))
        session.add(admin)
        await session.commit()
        print(f"✅ Админ '{login}' создан (id={admin.id})")


def main():
    parser = argparse.ArgumentParser(description="Добавление администратора")
    parser.add_argument("--login", required=True, help="Логин админа")
    parser.add_argument("--password", help="Пароль (если не указан — спросит)")
    args = parser.parse_args()

    password = args.password
    if not password:
        password = getpass.getpass("Пароль: ")
        password2 = getpass.getpass("Повторите пароль: ")
        if password != password2:
            print("❌ Пароли не совпадают")
            return

    if len(password) < 6:
        print("❌ Пароль должен быть не короче 6 символов")
        return

    asyncio.run(add_admin(args.login, password))


if __name__ == "__main__":
    main()