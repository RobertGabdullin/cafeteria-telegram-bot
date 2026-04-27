from datetime import date as date_type

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import Admin, Menu
from auth import get_db, get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


def parse_pdf_stub(pdf_bytes: bytes) -> dict:
    """Заглушка парсера PDF. Пока возвращает моковое меню."""
    return {
        "date": None,
        "timeRange": {"from": "10:00", "to": "16:00"},
        "namespace": None,
        "categories": [
            {"id": "hot", "name": "Горячее", "icon": "🍳"},
            {"id": "drinks", "name": "Напитки", "icon": "☕"},
        ],
        "dishes": [
            {
                "id": 1,
                "name": "Блюдо из загруженного PDF",
                "category": "hot",
                "price": 250,
                "weight": 200,
                "calories": 300,
                "protein": 20,
                "fat": 10,
                "carbs": 20,
                "composition": "Ингредиенты из PDF",
                "isDietary": False,
                "isPromo": False,
            },
        ],
    }


@router.post("/upload-menu")
async def upload_menu(
    file: UploadFile = File(...),
    namespace: str = Form(...),
    date: date_type = Form(...),
    admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Ожидается PDF файл")

    pdf_bytes = await file.read()

    try:
        menu_json = parse_pdf_stub(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Не удалось распарсить PDF: {e}")

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