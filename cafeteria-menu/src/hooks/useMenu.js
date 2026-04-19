import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchMenu } from "../api/menuApi";
import { filterDishes, getFilterRanges } from "../utils/filters";

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

export function useMenu(namespace) {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
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

  const isBusinessLunch = activeCategory === "business-lunch";

  const filteredDishes = useMemo(() => {
    if (!menu) return [];

    if (isBusinessLunch) {
      return filterDishes(menu.businessLunch.items, filters);
    }

    let dishes = menu.dishes;
    if (activeCategory !== "all") {
      dishes = dishes.filter((d) => d.category === activeCategory);
    }

    return filterDishes(dishes, filters);
  }, [menu, activeCategory, filters, isBusinessLunch]);

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

  return {
    menu,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    filters,
    updateFilter,
    resetFilters,
    filteredDishes,
    filterRanges,
    isBusinessLunch,
  };
}