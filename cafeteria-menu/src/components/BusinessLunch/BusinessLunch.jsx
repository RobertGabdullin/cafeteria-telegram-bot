import styles from "./BusinessLunch.module.css";
import DishList from "../DishList/DishList";

export default function BusinessLunch({ businessLunch, filteredItems, categories }) {
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
        Фиксированная цена — одно блюдо из каждой категории
      </div>
      <div className={styles.items}>
        <DishList
          dishes={filteredItems}
          categories={categories}
          showPrice={false}
          groupByCategory={true}
        />
      </div>
    </div>
  );
}