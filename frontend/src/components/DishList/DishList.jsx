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

    return (
      <div className={styles.container}>
        {Object.entries(grouped).map(([catName, catDishes]) => (
          <div key={catName} className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>
              {catName}
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
