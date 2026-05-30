import json
from datetime import date as date_type
from typing import Any

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import Admin, Menu
from auth import get_db, get_current_admin
from llm_service import suggest_dishes

router = APIRouter(prefix="/api/admin", tags=["admin"])


def convert_json_to_internal_format(data: dict[str, Any]) -> dict[str, Any]:
    """Конвертирует загруженный JSON во внутренний формат меню.
    
    Пока пустая заглушка - данные возвращаются как есть.
    """
    # TODO: реализовать конвертацию JSON в наш формат
    return data


@router.get("/namespaces/suggest")
async def suggest_namespaces(
    q: str = Query(..., min_length=1, description="Строка для поиска namespace"),
    db: AsyncSession = Depends(get_db),
):
    """Возвращает до 5 namespace, начинающихся с указанной строки."""
    result = await db.execute(
        select(Menu.namespace)
        .where(Menu.namespace.ilike(f"{q}%"))
        .distinct()
        .limit(5)
    )
    namespaces = [row[0] for row in result.all()]
    return {"suggestions": namespaces}


@router.get("/namespaces/check")
async def check_namespace(
    namespace: str = Query(..., description="Namespace для проверки"),
    db: AsyncSession = Depends(get_db),
):
    """Проверяет, существует ли namespace в базе данных."""
    result = await db.execute(
        select(Menu.namespace)
        .where(Menu.namespace == namespace)
        .limit(1)
    )
    exists = result.first() is not None
    return {"exists": exists, "namespace": namespace}


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


@router.post("/tray-suggest")
async def tray_suggest(
    user_prompt: str = Form(...),
    namespace: str = Form(...),
    time_range: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Подбирает блюда на основе пользовательского промпта с помощью LLM.
    
    Args:
        user_prompt: Описание пользователя (что хочет съесть)
        namespace: Namespace меню
        time_range: Временной диапазон (например, "09:00—12:00"), опционально
    
    Returns:
        Список ID подобранных блюд
    """
    # Получаем меню для namespace
    result = await db.execute(
        select(Menu).where(
            Menu.namespace == namespace,
            Menu.date == date_type.today(),
        )
    )
    menu = result.scalar_one_or_none()
    
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found for today")
    
    menu_data = menu.menu_json
    dishes = menu_data.get("dishes", [])
    
    # Фильтруем блюда по временному диапазону, если указан
    if time_range and time_range != "all":
        from_time, to_time = time_range.split("—")
        dishes = [
            d for d in dishes
            if (d.get("timeRange") or {}).get("from") == from_time
            and (d.get("timeRange") or {}).get("to") == to_time
        ]
    
    # Добавляем бизнес-ланч к доступным блюдам
    business_lunch = menu_data.get("businessLunch", {})
    bl_items = business_lunch.get("items", [])
    
    # Фильтруем бизнес-ланч по временному диапазону
    if time_range and time_range != "all":
        from_time, to_time = time_range.split("—")
        bl_items = [
            d for d in bl_items
            if (d.get("timeRange") or {}).get("from") == from_time
            and (d.get("timeRange") or {}).get("to") == to_time
        ]
    
    # Объединяем блюда
    all_dishes = dishes + bl_items
    
    # Формируем список блюд для отправки в LLM (только нужные поля)
    available_dishes = []
    for dish in all_dishes:
        available_dishes.append({
            "id": dish.get("id"),
            "name": dish.get("name", ""),
            "composition": dish.get("composition", ""),
            "kkal": dish.get("kkal"),
            "proteins": dish.get("proteins"),
            "fats": dish.get("fats"),
            "carbs": dish.get("carbs"),
        })
    
    # Вызываем LLM сервис
    suggested_ids = await suggest_dishes(user_prompt, available_dishes)
    
    return {"suggested_dish_ids": suggested_ids}
