/**
 * Фильтрация блюд по заданным параметрам
 */
export function filterDishes(dishes, filters) {
  return dishes.filter((dish) => {
    // Цена
    if (dish.price !== undefined) {
      if (dish.price < filters.priceMin || dish.price > filters.priceMax) {
        return false;
      }
    }

    // Калории
    if (filters.caloriesMax !== null && dish.calories > filters.caloriesMax) {
      return false;
    }

    // Белки
    if (filters.proteinMin !== null && dish.protein < filters.proteinMin) {
      return false;
    }

    // Жиры
    if (filters.fatMax !== null && dish.fat > filters.fatMax) {
      return false;
    }

    // Углеводы
    if (filters.carbsMax !== null && dish.carbs > filters.carbsMax) {
      return false;
    }

    // Только диетические
    if (filters.dietaryOnly && !dish.isDietary) {
      return false;
    }

    return true;
  });
}

/**
 * Получить диапазоны значений для фильтров из списка блюд
 */
export function getFilterRanges(dishes) {
  if (!dishes.length) {
    return {
      priceMin: 0,
      priceMax: 1000,
      caloriesMax: 500,
      proteinMax: 50,
      fatMax: 50,
      carbsMax: 100,
    };
  }

  return {
    priceMin: Math.min(...dishes.map((d) => d.price || 0)),
    priceMax: Math.max(...dishes.map((d) => d.price || 0)),
    caloriesMax: Math.max(...dishes.map((d) => d.calories)),
    proteinMax: Math.max(...dishes.map((d) => d.protein)),
    fatMax: Math.max(...dishes.map((d) => d.fat)),
    carbsMax: Math.max(...dishes.map((d) => d.carbs)),
  };
}