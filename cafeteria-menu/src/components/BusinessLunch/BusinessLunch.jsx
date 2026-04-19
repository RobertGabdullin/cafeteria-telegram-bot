import styles from "./BusinessLunch.module.css";
import DishCard from "../DishCard/DishCard";

export default function BusinessLunch({ businessLunch, filteredItems, categories }) {
  // Группируем блюда по категориям
  const grouped = {};
  filteredItems.forEach((dish) => {
    if (!grouped[dish.category]) grouped[dish.category] = [];
    grouped[dish.category].push(dish);
  });

  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.id] = c;
  });

  // Порядок категорий как в меню
  const orderedCategories = categories
    .filter((c) => c.id !== "business-lunch" && grouped[c.id])
    .map((c) => c.id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.titleIcon}>🍽️</span>
          Бизнес ланч
        </div>
        <div className={styles.price}>
          {businessLunch.price}{" "}
          <span className={styles.priceCurrency}>₽</span>
        </div>
      </div>
      <div className={styles.description}>
        Фиксированная цена — выберите по одному блюду из каждой категории
      </div>

      {orderedCategories.map((catId) => (
        <div key={catId} className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <span>{categoryMap[catId]?.icon}</span>
            <span className={styles.categoryName}>
              {categoryMap[catId]?.name}
            </span>
            <span className={styles.choiceBadge}>1 на выбор</span>
          </div>
          <div className={styles.categoryDishes}>
            {grouped[catId].map((dish, index) => (
              <div key={dish.id}>
                <DishCard dish={dish} showPrice={false} />
                {index < grouped[catId].length - 1 && (
                  <div className={styles.orDivider}>
                    <div className={styles.orLine} />
                    <span className={styles.orText}>или</span>
                    <div className={styles.orLine} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}