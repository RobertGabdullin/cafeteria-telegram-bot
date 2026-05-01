import React from "react"
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import styles from "./App.module.css";
import { useMenu } from "./hooks/useMenu";
import { filterDishes } from "./utils/filters";
import Header from "./components/Header/Header";
import FilterBar from "./components/FilterBar/FilterBar";
import Filters from "./components/Filters/Filters";
import DishList from "./components/DishList/DishList";
import BusinessLunch from "./components/BusinessLunch/BusinessLunch";
import Cart from "./components/Cart/Cart";

export default function App() {
  const { namespace } = useParams();
  const {
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
  } = useMenu(namespace);

  // Извлечение уникальных категорий из блюд (category теперь это имя)
  const categories = useMemo(() => {
    if (!menu) return [];
    const categorySet = new Set();
    
    // Фильтруем блюда по временному диапазону (если выбран)
    let dishesToConsider = menu.dishes;
    if (activeTimeRange !== "all") {
      const [from, to] = activeTimeRange.split("—");
      dishesToConsider = dishesToConsider.filter((d) => {
        if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
        return d.timeRange.from === from && d.timeRange.to === to;
      });
    }
    
    // Добавляем только категории, у которых есть блюда в выбранном диапазоне
    dishesToConsider.forEach((dish) => categorySet.add(dish.category));
    
    // Добавляем категорию "Бизнес ланч" если есть бизнес-ланч
    if (menu.businessLunch) {
      // Для бизнес-ланча также проверяем временной диапазон
      let blItemsToConsider = menu.businessLunch.items;
      if (activeTimeRange !== "all") {
        const [from, to] = activeTimeRange.split("—");
        blItemsToConsider = blItemsToConsider.filter((d) => {
          if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
          return d.timeRange.from === from && d.timeRange.to === to;
        });
      }
      if (blItemsToConsider.length > 0) {
        categorySet.add("Бизнес ланч");
      }
    }
    
    // category теперь и есть имя, используем его же как id
    return Array.from(categorySet).map((name) => ({
      id: name,
      name,
    }));
  }, [menu, activeTimeRange]);

  // Подсчёт блюд по категориям (для табов) — учитываем все фильтры
  const dishCounts = useMemo(() => {
    if (!menu) return {};
    const counts = {};

    // Считаем по отфильтрованным блюдам (не бизнес-ланч)
    let filtered = filterDishes(menu.dishes, filters);
    
    // Учитываем временной диапазон
    if (activeTimeRange !== "all") {
      const [from, to] = activeTimeRange.split("—");
      filtered = filtered.filter((d) => {
        if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
        return d.timeRange.from === from && d.timeRange.to === to;
      });
    }
    
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
      let filteredBL = filterDishes(menu.businessLunch.items, nutritionFilters);
      
      // Учитываем временной диапазон для бизнес-ланча
      if (activeTimeRange !== "all") {
        const [from, to] = activeTimeRange.split("—");
        filteredBL = filteredBL.filter((d) => {
          if (!d.timeRange || !d.timeRange.from || !d.timeRange.to) return false;
          return d.timeRange.from === from && d.timeRange.to === to;
        });
      }
      
      counts["Бизнес ланч"] = filteredBL.length;
    }

    return counts;
  }, [menu, filters, activeTimeRange]);

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
    const cls = [styles.app, styles.errorContainer, styles.errorIcon, styles.errorTitle, styles.errorText, styles.errorHint];

    return React.createElement("div", { className: cls[0] },
      React.createElement(Header),
      React.createElement("div", { className: cls[1] },
        React.createElement("span", { className: cls[2] }, "🍽️"),
        React.createElement("span", { className: cls[3] }, "Меню не найдено"),
        React.createElement("span", { className: cls[4] }, "Меню для этой точки ещё не загружено или не доступно на сегодня"),
        React.createElement("span", { className: cls[5] }, "Проверьте адрес или попробуйте позже")
      )
    );
  }

  return (
    <div className={styles.app}>
      <Header date={menu.date}/>

      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        timeRanges={timeRanges}
        activeTimeRange={activeTimeRange}
        onTimeRangeChange={setActiveTimeRange}
        dishCounts={dishCounts}
      />

      <div className={styles.layout}>
      <Filters
        filters={filters}
        ranges={filterRanges}
        onUpdateFilter={updateFilter}
        onReset={resetFilters}
        availableTags={availableTags}
      />

        <div className={styles.mainContent}>
          <div className={styles.resultsInfo}>
            <span className={styles.resultsCount}>
              {isBusinessLunch
                ? `Бизнес ланч — ${filteredDishes.length} позиций`
                : `Найдено: ${filteredDishes.length} блюд`}
            </span>
          </div>

          <DishList
            dishes={filteredDishes}
            categories={categories}
            showPrice={true}
            groupByCategory={activeCategory === "all"}
            isBusinessLunchCategory={isBusinessLunch}
            businessLunchPrice={menu?.businessLunch?.price}
          />
        </div>
      </div>
      <Cart />
    </div>
  );
}
