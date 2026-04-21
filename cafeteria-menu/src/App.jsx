import { useMemo } from "react";
import styles from "./App.module.css";
import { useMenu } from "./hooks/useMenu";
import { filterDishes } from "./utils/filters";
import Header from "./components/Header/Header";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import Filters from "./components/Filters/Filters";
import DishList from "./components/DishList/DishList";
import BusinessLunch from "./components/BusinessLunch/BusinessLunch";

export default function App() {
  const {
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
  } = useMenu("cafeteria-main");

  // Подсчёт блюд по категориям (для табов)
  const dishCounts = useMemo(() => {
    if (!menu) return {};
    const counts = {};

    // Считаем по отфильтрованным блюдам (не бизнес-ланч)
    const filtered = filterDishes(menu.dishes, filters);
    filtered.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });

    // Бизнес-ланч — считаем с КЖБУ фильтрами, без цены
    if (menu.businessLunch) {
      const nutritionFilters = {
        ...filters,
        priceMin: 0,
        priceMax: Infinity,
      };
      const filteredBL = filterDishes(menu.businessLunch.items, nutritionFilters);
      counts["business-lunch"] = filteredBL.length;
    }

    return counts;
  }, [menu, filters]);

  if (loading) {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Загружаем меню...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.errorContainer}>
          <span className={styles.errorIcon}>😕</span>
          <span className={styles.errorText}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header date={menu.date} timeRange={menu.timeRange} />

      <CategoryTabs
        categories={menu.categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        dishCounts={dishCounts}
      />

      <div className={styles.layout}>
        <Filters
          filters={filters}
          ranges={filterRanges}
          onUpdateFilter={updateFilter}
          onReset={resetFilters}
        />

        <div className={styles.mainContent}>
          <div className={styles.resultsInfo}>
            <span className={styles.resultsCount}>
              {isBusinessLunch
                ? `Бизнес ланч — ${filteredDishes.length} позиций`
                : `Найдено: ${filteredDishes.length} блюд`}
            </span>
          </div>

          {isBusinessLunch && menu.businessLunch ? (
            <BusinessLunch
              businessLunch={menu.businessLunch}
              filteredItems={filteredDishes}
              categories={menu.categories}
            />
          ) : (
            <DishList
              dishes={filteredDishes}
              categories={menu.categories}
              showPrice={true}
              groupByCategory={activeCategory === "all"}
            />
          )}
        </div>
      </div>
    </div>
  );
}