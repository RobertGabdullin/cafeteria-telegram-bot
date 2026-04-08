import styles from "./CategoryTabs.module.css";

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  dishCounts,
}) {
  const allCount = Object.entries(dishCounts)
    .filter(([key]) => key !== "business-lunch")
    .reduce((sum, [, count]) => sum + count, 0);

  function getTabClass(categoryId) {
    const isActive = activeCategory === categoryId;
    const isBL = categoryId === "business-lunch";

    const classes = [styles.tab];

    if (isBL && isActive) {
      classes.push(styles.tabBusinessLunchActive);
    } else if (isBL) {
      classes.push(styles.tabBusinessLunch);
    } else if (isActive) {
      classes.push(styles.tabActive);
    }

    return classes.join(" ");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeCategory === "all" ? styles.tabActive : ""}`}
          onClick={() => onCategoryChange("all")}
        >
          Все
          <span className={styles.tabCount}>{allCount}</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={getTabClass(cat.id)}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span className={styles.tabIcon}>{cat.icon}</span>
            {cat.name}
            {dishCounts[cat.id] !== undefined && (
              <span className={styles.tabCount}>{dishCounts[cat.id]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}