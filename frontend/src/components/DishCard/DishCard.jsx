import { useState, useCallback } from "react";
import styles from "./DishCard.module.css";
import CompositionTooltip from "../CompositionTooltip/CompositionTooltip";
import { useCart } from "../../contexts/CartContext";

export default function DishCard({ dish, showPrice = true, businessLunchPrice }) {
  const { toggleDish, toggleBusinessLunchDish, isDishSelected } = useCart();
  const isSelected = isDishSelected(dish.id);
  const [isClickBlocked, setIsClickBlocked] = useState(false);

  const handleBlockClicks = useCallback(() => {
    setIsClickBlocked(true);
    setTimeout(() => {
      setIsClickBlocked(false);
    }, 300);
  }, []);

  const handleClick = () => {
    if (isClickBlocked) {
      return;
    }
    if (dish.isBusinessLunch) {
      toggleBusinessLunchDish(dish, businessLunchPrice);
    } else {
      toggleDish(dish);
    }
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.mainInfo}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{dish.name}</span>
          <div className={styles.badges}>
            {dish.isBusinessLunch && (
              <span className={`${styles.badge} ${styles.badgeBusinessLunch}`}>
                Бизнес ланч
              </span>
            )}
            {dish.tags && dish.tags.map((tag) => (
              <span key={tag} className={styles.badge}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.compositionWrapper} onClick={(e) => e.stopPropagation()}>
            <CompositionTooltip composition={dish.composition} onBlockClicks={handleBlockClicks} />
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
