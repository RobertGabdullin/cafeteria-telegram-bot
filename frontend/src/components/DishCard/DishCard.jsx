import styles from "./DishCard.module.css";
import CompositionTooltip from "../CompositionTooltip/CompositionTooltip";

export default function DishCard({ dish, showPrice = true }) {
  return (
    <div className={styles.card}>
      <div className={styles.mainInfo}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{dish.name}</span>
          <div className={styles.badges}>
            {dish.isDietary && (
              <span className={styles.badgeDietary}>Диетическое</span>
            )}
            {dish.isPromo && <span className={styles.badgePromo}>Акция</span>}
          </div>
          <div className={styles.compositionWrapper}>
            <CompositionTooltip composition={dish.composition} />
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.weight}>{dish.weight} г</span>
          <div className={styles.nutrients}>
            <div className={`${styles.nutrient} ${styles.nutrientCalories}`}>
              <span className={styles.nutrientValue}>{dish.calories}</span>
              <span className={styles.nutrientLabel}>ккал</span>
            </div>
            <div className={`${styles.nutrient} ${styles.nutrientProtein}`}>
              <span className={styles.nutrientValue}>{dish.protein}</span>
              <span className={styles.nutrientLabel}>белки</span>
            </div>
            <div className={`${styles.nutrient} ${styles.nutrientFat}`}>
              <span className={styles.nutrientValue}>{dish.fat}</span>
              <span className={styles.nutrientLabel}>жиры</span>
            </div>
            <div className={`${styles.nutrient} ${styles.nutrientCarbs}`}>
              <span className={styles.nutrientValue}>{dish.carbs}</span>
              <span className={styles.nutrientLabel}>углев</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        {showPrice && dish.price !== undefined && (
          <span className={styles.price}>
            {dish.price} <span className={styles.priceCurrency}>₽</span>
          </span>
        )}
      </div>
    </div>
  );
}
