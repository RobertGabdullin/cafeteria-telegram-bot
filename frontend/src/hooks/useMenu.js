import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchMenu } from "../api/menuApi";
import { filterDishes, getFilterRanges, getAvailableTags } from "../utils/filters";

const INITIAL_FILTERS = {
  priceMin: 0,
  priceMax: 10000,
  caloriesMin: 0,
  caloriesMax: null,
  proteinMin: 0,
  proteinMax: null,
  fatMin: 0,
  fatMax: null,
  carbsMin: 0,
  carbsMax: null,
  dietaryOnly: false,
};

// Получить текущее время в формате "HH:MM"
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Проверка, попадает ли время в диапазон
function isTimeInRange(currentTime, timeRange) {
  if (!timeRange || !timeRange.from || !timeRange.to) return false;
  return currentTime >= timeRange.from && currentTime <= timeRange.to;
}

// Извлечь уникальные временные диапазоны из блюд
function extractTimeRanges(dishes) {
  const ranges = new Map();
  dishes.forEach((dish) => {
    if (dish.timeRange && dish.timeRange.from && dish.timeRange.to) {
      const label = `${dish.timeRange.from}—${dish.timeRange.to}`;
      ranges.set(label, dish.timeRange);
    }
  });
  return Array.from(ranges.entries()).map(([label, range]) => ({ label, ...range }));
}

export function useMenu(namespace) {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTimeRange, setActiveTimeRange] = useState("all");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMenu(namespace);
        if (!cancelled) {
          setMenu(data);
          const ranges = getFilterRanges(data.dishes);
          setFilters((prev) => ({
            ...prev,
            priceMin: ranges.priceMin,
            priceMax: ranges.priceMax,
            caloriesMin: 0,
            caloriesMax: ranges.caloriesMax,
            proteinMin: 0,
            proteinMax: ranges.proteinMax,
            fatMin: 0,
            fatMax: ranges.fatMax,
            carbsMin: 0,
            carbsMax: ranges.carbsMax,
          }));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [namespace]);

  // Временные диапазоны из блюд
  const timeRanges = useMemo(() => {
    if (!menu) return [];
    return extractTimeRanges(menu.dishes);
  }, [menu]);

  // Определение текущего временного диапазона
  const defaultTimeRange = useMemo(() => {
    if (!menu || timeRanges.length === 0) return "all";
    const currentTime = getCurrentTime();
    const matchingRange = timeRanges.find((range) =>
      isTimeInRange(currentTime, range)
    );
    return matchingRange ? matchingRange.label : "all";
  }, [menu, timeRanges]);

  // Инициализация activeTimeRange после загрузки меню
  useEffect(() => {
    if (menu && activeTimeRange === "all" && timeRanges.length > 0) {
      const currentTime = getCurrentTime();
      const matchingRange = timeRanges.find((range) =>
        isTimeInRange(currentTime, range)
      );
      if (matchingRange) {
        setActiveTimeRange(matchingRange.label);
      }
    }
  }, [menu, timeRanges]);

  const isBusinessLunch = activeCategory === "Бизнес ланч";

  const filteredDishes = useMemo(() => {
    if (!menu) return [];

    // Если выбрана категория "Бизнес ланч" — показываем только бизнес-ланч
    if (isBusinessLunch) {
      const nutritionFilters = {
        ...filters,
        priceMin: 0,
        priceMax: Infinity,
      };
      // Добавляем флаг isBusinessLunch и businessLunchPrice к блюдам
      return filterDishes(menu.businessLunch.items, nutritionFilters).map((dish) => ({
        ...dish,
        isBusinessLunch: true,
        businessLunchPrice: menu.businessLunch.price,
      }));
    }

    // Если выбрана категория "Все" — показываем обычные блюда + бизнес-ланч
    if (activeCategory === "all") {
      let dishes = menu.dishes;

      // Фильтрация по временному диапазону
      if (activeTimeRange !== "all") {
        const [from, to] = activeTimeRange.split("—");
        dishes = dishes.filter((d) => {
          if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
          return d.timeRange.from === from && d.timeRange.to === to;
        });
      }

      // Добавляем бизнес-ланч к обычным блюдам
      const nutritionFilters = {
        ...filters,
        priceMin: 0,
        priceMax: Infinity,
      };
      let blDishes = filterDishes(menu.businessLunch.items, nutritionFilters);

      // Фильтрация бизнес-ланча по временному диапазону
      if (activeTimeRange !== "all") {
        const [from, to] = activeTimeRange.split("—");
        blDishes = blDishes.filter((d) => {
          if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
          return d.timeRange.from === from && d.timeRange.to === to;
        });
      }

      // Добавляем к блюдам бизнес-ланч с пометкой
      const blDishesWithCategory = blDishes.map((d) => ({
        ...d,
        isBusinessLunch: true,
      }));

      return [...filterDishes(dishes, filters), ...blDishesWithCategory];
    }

    // Если выбрана конкретная категория — показываем только её
    let dishes = menu.dishes.filter((d) => d.category === activeCategory);

    // Фильтрация по временному диапазону
    if (activeTimeRange !== "all") {
      const [from, to] = activeTimeRange.split("—");
      dishes = dishes.filter((d) => {
        if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
        return d.timeRange.from === from && d.timeRange.to === to;
      });
    }

    return filterDishes(dishes, filters);
  }, [menu, activeCategory, activeTimeRange, filters, isBusinessLunch]);

  const filterRanges = useMemo(() => {
    if (!menu) return getFilterRanges([]);
    return getFilterRanges(menu.dishes);
  }, [menu]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    if (!menu) return;
    const ranges = getFilterRanges(menu.dishes);
    setFilters({
      ...INITIAL_FILTERS,
      priceMin: ranges.priceMin,
      priceMax: ranges.priceMax,
      caloriesMax: ranges.caloriesMax,
      proteinMax: ranges.proteinMax,
      fatMax: ranges.fatMax,
      carbsMax: ranges.carbsMax,
    });
  }, [menu]);

  // Доступные теги из всех блюд
  const availableTags = useMemo(() => {
    if (!menu) return [];
    return getAvailableTags(menu.dishes);
  }, [menu]);

  return {
    menu,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    activeTimeRange,
    setActiveTimeRange,
    timeRanges,
    filters,
    updateFilter,
    resetFilters,
    filteredDishes,
    filterRanges,
    isBusinessLunch,
    availableTags,
  };
}
