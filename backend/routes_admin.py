import json
from datetime import date as date_type
from typing import Any

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import Admin, Menu
from auth import get_db, get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


def convert_json_to_internal_format(data: dict[str, Any]) -> dict[str, Any]:
    """Конвертирует загруженный JSON во внутренний формат меню.
    
    Пока пустая заглушка - данные возвращаются как есть.
    """
    # TODO: реализовать конвертацию JSON в наш формат
    return data


@router.post("/upload-menu")
async def upload_menu(
    file: UploadFile = File(...),
    namespace: str = Form(...),
    date: date_type = Form(...),
    admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ("application/json", "text/json"):
        raise HTTPException(status_code=400, detail="Ожидается JSON файл")

    file_content = await file.read()

    try:
        menu_json = json.loads(file_content.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        raise HTTPException(status_code=422, detail=f"Не удалось распарсить JSON: {e}")

    # Конвертируем JSON во внутренний формат
    menu_json = convert_json_to_internal_format(menu_json)

    # Проставляем namespace и date в самом JSON
    menu_json["namespace"] = namespace
    menu_json["date"] = str(date)

    menu = Menu(namespace=namespace, date=date, menu_json=menu_json)
    await db.merge(menu)
    await db.commit()

    return {
        "ok": True,
        "namespace": namespace,
        "date": str(date),
        "uploaded_by": admin.login,
    }
