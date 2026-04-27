from datetime import date
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import select

from database import async_session, Menu
from routes_auth import router as auth_router
from routes_admin import router as admin_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(admin_router)

dist_path = Path(__file__).parent.parent / "frontend" / "dist"


@app.get("/api/menu/{namespace}")
async def get_menu(namespace: str):
    async with async_session() as session:
        result = await session.execute(
            select(Menu).where(
                Menu.namespace == namespace,
                Menu.date == date.today(),
            )
        )
        menu = result.scalar_one_or_none()

    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found for today")

    return menu.menu_json


if dist_path.exists():
    app.mount("/assets", StaticFiles(directory=str(dist_path / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        file_path = dist_path / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_path / "index.html")