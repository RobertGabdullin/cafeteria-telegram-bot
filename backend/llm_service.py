import httpx
import json
from typing import Any

from config import settings


async def suggest_dishes(
    user_prompt: str,
    available_dishes: list[dict[str, Any]],
) -> list[int]:
    """
    Отправляет запрос к LLM для подбора блюд на основе пользовательского промпта.
    
    Args:
        user_prompt: Описание пользователя (что хочет съесть)
        available_dishes: Список доступных блюд с параметрами (id, name, composition, kkal, proteins, fats, carbs)
    
    Returns:
        Список ID подобранных блюд
    """
    # Формируем системный промпт с информацией о доступных блюдах
    dishes_info = []
    for dish in available_dishes:
        # weight может быть строкой (например, "250 г") или числом
        weight = dish.get('weight', 'N/A')
        if isinstance(weight, (int, float)):
            weight_str = f"{int(weight)} г"
        else:
            weight_str = str(weight)
        
        dish_str = (
            f"ID: {dish['id']}, "
            f"Название: {dish['name']}, "
            f"Вес: {weight_str}, "
            f"Калории: {dish.get('kkal', 'N/A')}, "
            f"Белки: {dish.get('proteins', 'N/A')}г, "
            f"Жиры: {dish.get('fats', 'N/A')}г, "
            f"Углеводы: {dish.get('carbs', 'N/A')}г, "
            f"Состав: {dish.get('composition', 'N/A')}"
        )
        dishes_info.append(dish_str)
    
    dishes_list = "\n".join(dishes_info)
    
    system_prompt = (
        f"Ты полезный ассистент, который помогает подобрать блюда из меню.\n\n"
        f"Вот доступные блюда:\n"
        f"[{dishes_list}]\n\n"
        f"Правила подбора блюд:\n"
        f"1. Верни ТОЛЬКО массив ID в формате JSON, например: [1, 3, 5]. Никаких дополнительных объяснений.\n"
        f"2. Не выбирай больше 3 блюд, если только пользователь явно не говорит, что хочет много еды (например, 'хочу много поесть', 'нужен плотный обед').\n"
        f"3. Не выбирай много блюд из одной категории (например, только супы или только напитки), если пользователь явно об этом не просит. Старайся разнообразить подборку.\n"
        f"4. Важное правило про бизнес-ланчи: если в меню есть блюда из бизнес-ланча, помни — при выборе хотя бы одного блюда из бизнес-ланча, пользователь платит за весь бизнес-ланч целиком. Поэтому:\n"
        f"   - Либо выбирай только блюда из бизнес-ланча (можно добавить 1-2 дополнительных блюда сверху, если это уместно по запросу пользователя),\n"
        f"   - Либо вовсе избегай блюд из бизнес-ланча и выбирай только обычные блюда.\n"
        f"   - Если выбираешь хотя бы одно блюдо из бизнес-ланча, постарайся довыбрать все оставшиеся блюда из бизнес-ланча других категорий (суп, горячее, салат, напиток и т.д.), так как стоимость уже оплачена — это максимально выгодно для пользователя.\n"
        f"   - Не выбирай одно блюдо из бизнес-ланча без остальных — это невыгодно для пользователя.\n"
        f"5. Учитывай пожелания пользователя: калорийность, состав, тип блюда (суп, горячее, напиток и т.д.).\n\n"
        f"Примеры правильного ответа:\n"
        f"- [2, 5, 8] — три разных блюда\n"
        f"- [1, 3] — два блюда для лёгкого перекуса\n"
        f"- [4] — одно блюдо, если пользователь хочет что-то конкретное\n"
    )
    
    try:
        async with httpx.AsyncClient(timeout=30.0, verify=False) as client:
            response = await client.post(
                settings.LLM_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.LLM_API_KEY}",
                },
                json={
                    "model": settings.LLM_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.4,
                },
            )
            response.raise_for_status()
            data = response.json()
            
            # Извлекаем ответ из choices[0].message.content
            content = data["choices"][0]["message"]["content"]
            
            # Парсим JSON массив из ответа
            dish_ids = json.loads(content.strip())
            
            # Возвращаем список ID (убеждаемся, что это integers)
            return [int(id_) for id_ in dish_ids]
            
    except (httpx.HTTPError, json.JSONDecodeError, KeyError, ValueError) as e:
        # В случае ошибки возвращаем пустой список
        print(f"Error calling LLM API: {e}")
        return []
