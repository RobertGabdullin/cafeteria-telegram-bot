import styles from "./DishList.module.css";
import DishCard from "../DishCard/DishCard";

export default function DishList({
  dishes,
  categories,
  showPrice = true,
  groupByCategory = false,
  businessLunchPrice,
  isBusinessLunchCategory = false,
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

  // Если выбрана категория "Бизнес ланч" или группа "Все"
  if (groupByCategory && categories || isBusinessLunchCategory) {
    const grouped = {};
    const blGrouped = {};
    
    dishes.forEach((dish) => {
      // Бизнес-ланч группируем по категориям внутри бизнес-ланча
      if (dish.isBusinessLunch) {
        if (!blGrouped[dish.category]) blGrouped[dish.category] = [];
        blGrouped[dish.category].push(dish);
      } else {
        if (!grouped[dish.category]) grouped[dish.category] = [];
        grouped[dish.category].push(dish);
      }
    });

    return (
      <div className={styles.container}>
        {/* Обычные блюда */}
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
                  businessLunchPrice={businessLunchPrice}
                />
              ))}
            </div>
          </div>
        ))}
        
        {/* Бизнес-ланч */}
        {Object.entries(blGrouped).length > 0 && (
          <div key="business-lunch" className={styles.categoryGroup}>
            <div className={styles.categoryTitle}>
              <span>Бизнес ланч</span>
              {businessLunchPrice && (
                <span className={styles.businessLunchPrice}>{businessLunchPrice} ₽</span>
              )}
            </div>
            {Object.entries(blGrouped).map(([catName, catDishes]) => (
              <div key={catName} className={styles.blSubcategory}>
                <div className={styles.blSubcategoryTitle}>
                  {catName} <span className={styles.blSelectOne}>(1 на выбор)</span>
                </div>
                <div className={styles.dishesInGroup}>
                  {catDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      showPrice={false}
                      businessLunchPrice={businessLunchPrice}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {dishes.map((dish) => (
        <DishCard 
          key={dish.id} 
          dish={dish} 
          showPrice={showPrice}
          businessLunchPrice={businessLunchPrice}
        />
      ))}
    </div>
  );
}
