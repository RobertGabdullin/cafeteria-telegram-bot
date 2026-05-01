import styles from "./BusinessLunch.module.css";
import DishCard from "../DishCard/DishCard";

export default function BusinessLunch({ businessLunch, filteredItems, categories }) {
  // Все блюда сгруппированные (для отображения пустых категорий)
  const allGrouped = {};
  businessLunch.items.forEach((dish) => {
    if (!allGrouped[dish.category]) allGrouped[dish.category] = [];
    allGrouped[dish.category].push(dish);
  });

  // Отфильтрованные блюда
  const filteredSet = new Set(filteredItems.map((d) => d.id));

  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.name] = c;
  });

  // Порядок категорий как в меню (исключаем бизнес-ланч)
  const orderedCategories = categories
    .filter((c) => c.name !== "Бизнес ланч" && allGrouped[c.name])
    .map((c) => c.name);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
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

      {orderedCategories.map((catId) => {
        const allDishes = allGrouped[catId];
        const visibleDishes = allDishes.filter((d) => filteredSet.has(d.id));
        const allHidden = visibleDishes.length === 0;

        return (
          <div key={catId} className={styles.categorySection}>
            <div className={`${styles.categoryHeader} ${allHidden ? styles.categoryHeaderEmpty : ""}`}>
              <span className={styles.categoryName}>
                {categoryMap[catId]?.name}
              </span>
              <span className={styles.choiceBadge}>1 на выбор</span>
              {allHidden && (
                <span className={styles.emptyBadge}>нет подходящих</span>
              )}
            </div>

            {allHidden ? (
              <div className={styles.emptyCategory}>
                Ни одно блюдо не соответствует фильтрам
              </div>
            ) : (
              <div className={styles.categoryDishes}>
                {visibleDishes.map((dish, index) => (
                  <div key={dish.id}>
                    <DishCard dish={dish} showPrice={false} />
                    {index < visibleDishes.length - 1 && (
                      <div className={styles.orDivider}>
                        <div className={styles.orLine} />
                        <span className={styles.orText}>или</span>
                        <div className={styles.orLine} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
