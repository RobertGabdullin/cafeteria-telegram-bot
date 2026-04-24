export function filterDishes(dishes, filters) {
  return dishes.filter((dish) => {
    if (dish.price !== undefined) {
      if (dish.price < filters.priceMin || dish.price > filters.priceMax) {
        return false;
      }
    }

    if (filters.caloriesMax !== null && dish.calories > filters.caloriesMax) return false;
    if (filters.caloriesMin && dish.calories < filters.caloriesMin) return false;

    if (filters.proteinMax !== null && dish.protein > filters.proteinMax) return false;
    if (filters.proteinMin && dish.protein < filters.proteinMin) return false;

    if (filters.fatMax !== null && dish.fat > filters.fatMax) return false;
    if (filters.fatMin && dish.fat < filters.fatMin) return false;

    if (filters.carbsMax !== null && dish.carbs > filters.carbsMax) return false;
    if (filters.carbsMin && dish.carbs < filters.carbsMin) return false;

    if (filters.dietaryOnly && !dish.isDietary) return false;

    return true;
  });
}

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