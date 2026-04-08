import styles from "./DishList.module.css";
import DishCard from "../DishCard/DishCard";

export default function DishList({
  dishes,
  categories,
  showPrice = true,
  groupByCategory = false,
}) {
  if (!dishes.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🍽️</div>
        <div className={styles.emptyText}>Блюда не найдены</div>
        <div className={styles.emptyHint}>
          Попробуйте изменить фильтры или выбрать другую категорию
        </div>
      </div>
    );
  }

  if (groupByCategory && categories) {
    const grouped = {};
    dishes.forEach((dish) => {
      if (!grouped[dish.category]) grouped[dish.category] = [];
      grouped[dish.category].push(dish);
    });

    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.id] = c;
    });

    return (
      <div className={styles.container}>
        {Object.entries(grouped).map(([catId, catDishes]) => (
          <div key={catId} className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>
              {categoryMap[catId]?.icon} {categoryMap[catId]?.name || catId}
            </div>
            <div className={styles.dishesInGroup}>
              {catDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  showPrice={showPrice}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} showPrice={showPrice} />
      ))}
    </div>
  );
}