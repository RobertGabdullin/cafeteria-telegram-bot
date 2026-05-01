import { useState } from "react";
import styles from "./FilterBar.module.css";

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  timeRanges,
  activeTimeRange,
  onTimeRangeChange,
  dishCounts,
}) {
  const [expandedMode, setExpandedMode] = useState(null); // 'category' | 'range' | null

  const allCount = Object.entries(dishCounts || {})
    .filter(([key]) => key !== "Бизнес ланч")
    .reduce((sum, [, count]) => sum + count, 0);

  const handleCategoryClick = () => {
    setExpandedMode(expandedMode === "category" ? null : "category");
  };

  const handleRangeClick = () => {
    setExpandedMode(expandedMode === "range" ? null : "range");
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
    setExpandedMode(null);
  };

  const handleRangeSelect = (rangeLabel) => {
    onTimeRangeChange(rangeLabel);
    setExpandedMode(null);
  };

  const getCategoryLabel = () => {
    if (activeCategory === "all") return "Категория: Все";
    const cat = categories.find((c) => c.id === activeCategory);
    return `Категория: ${cat?.name || "Все"}`;
  };

  const getRangeLabel = () => {
    if (activeTimeRange === "all") return "Диапазон: Все";
    return activeTimeRange ? `Диапазон: ${activeTimeRange}` : "Диапазон";
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {/* Исходное состояние: обе кнопки видны */}
        {expandedMode === null && (
          <>
            <button
              className={styles.button}
              onClick={handleCategoryClick}
            >
              <span className={styles.buttonIcon}>📁</span>
              <span className={styles.buttonLabel}>{getCategoryLabel()}</span>
            </button>

            <button
              className={styles.button}
              onClick={handleRangeClick}
              disabled={!timeRanges || timeRanges.length === 0}
            >
              <span className={styles.buttonIcon}>🕐</span>
              <span className={styles.buttonLabel}>{getRangeLabel()}</span>
            </button>
          </>
        )}

        {/* Список категорий */}
        {expandedMode === "category" && (
          <div className={styles.expandedList}>
            <button
              className={`${styles.expandedItem} ${activeCategory === "all" ? styles.expandedItemActive : ""}`}
              onClick={() => handleCategorySelect("all")}
            >
              Все
              <span className={styles.itemCount}>{allCount}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.expandedItem} ${activeCategory === cat.id ? styles.expandedItemActive : ""}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.name}
                {dishCounts?.[cat.id] !== undefined && (
                  <span className={styles.itemCount}>{dishCounts[cat.id]}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Список диапазонов */}
        {expandedMode === "range" && timeRanges && timeRanges.length > 0 && (
          <div className={styles.expandedList}>
            <button
              className={`${styles.expandedItem} ${activeTimeRange === "all" ? styles.expandedItemActive : ""}`}
              onClick={() => handleRangeSelect("all")}
            >
              Все
            </button>
            {timeRanges.map((range) => (
              <button
                key={range.label}
                className={`${styles.expandedItem} ${activeTimeRange === range.label ? styles.expandedItemActive : ""}`}
                onClick={() => handleRangeSelect(range.label)}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
