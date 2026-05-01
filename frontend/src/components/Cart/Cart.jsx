import { useCart } from "../../contexts/CartContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const {
    isCartOpen,
    setIsCartOpen,
    selectedDishes,
    cartTotals,
    clearCart,
    toggleDish,
    toggleBusinessLunchDish,
  } = useCart();

  // Группируем блюда бизнес-ланча по категориям
  const blGroups = {};
  const regularDishes = [];

  selectedDishes.forEach((dish) => {
    if (dish.isBusinessLunch) {
      if (!blGroups[dish.category]) blGroups[dish.category] = [];
      blGroups[dish.category].push(dish);
    } else {
      regularDishes.push(dish);
    }
  });

  const handleDishClick = (dish) => {
    if (dish.isBusinessLunch) {
      toggleBusinessLunchDish(dish);
    } else {
      toggleDish(dish);
    }
  };

  if (selectedDishes.length === 0 && !isCartOpen) {
    return null;
  }

  return (
    <>
      {/* Кнопка корзины */}
      <button
        className={styles.cartButton}
        onClick={() => setIsCartOpen(true)}
      >
        <span className={styles.cartIcon}>🛒</span>
        {cartTotals.itemCount > 0 && (
          <span className={styles.cartBadge}>{cartTotals.itemCount}</span>
        )}
      </button>

      {/* Затемнение фона */}
      {isCartOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Модальное окно корзины */}
      {isCartOpen && (
        <div className={styles.cartModal}>
          <div className={styles.cartHeader}>
            <h2 className={styles.cartTitle}>Корзина</h2>
            <button
              className={styles.closeButton}
              onClick={() => setIsCartOpen(false)}
            >
              ✕
            </button>
          </div>

          {selectedDishes.length === 0 ? (
            <div className={styles.emptyCart}>
              <span className={styles.emptyIcon}>🛒</span>
              <p>Корзина пуста</p>
            </div>
          ) : (
            <>
              <div className={styles.cartItems}>
                {/* Обычные блюда */}
                {regularDishes.length > 0 && regularDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className={styles.cartItem}
                    onClick={() => handleDishClick(dish)}
                  >
                    <div className={styles.cartItemInfo}>
                      <span className={styles.cartItemName}>{dish.name}</span>
                    </div>
                    <div className={styles.cartItemDetails}>
                      <span className={styles.cartItemWeight}>{dish.weight} г</span>
                      <span className={styles.cartItemCalories}>{dish.calories} ккал</span>
                      <span className={styles.cartItemPrice}>{dish.price} ₽</span>
                    </div>
                    <button className={styles.removeItem}>✕</button>
                  </div>
                ))}

                {/* Бизнес-ланч */}
                {Object.entries(blGroups).length > 0 && (
                  <div className={regularDishes.length > 0 ? styles.blGroupSection : ''}>
                    <div className={styles.blGroupTitle}>Бизнес ланч</div>
                    {Object.entries(blGroups).map(([category, dishes]) => (
                      <div key={category} className={styles.blCategory}>
                        <span className={styles.blCategoryName}>{category}:</span>
                        {dishes.map((dish) => (
                          <div
                            key={dish.id}
                            className={styles.cartItem}
                            onClick={() => handleDishClick(dish)}
                          >
                            <div className={styles.cartItemInfo}>
                              <span className={styles.cartItemName}>{dish.name}</span>
                            </div>
                            <div className={styles.cartItemDetails}>
                              <span className={styles.cartItemWeight}>{dish.weight} г</span>
                              <span className={styles.cartItemCalories}>{dish.calories} ккал</span>
                            </div>
                            <button className={styles.removeItem}>✕</button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.cartTotals}>
                <div className={styles.totalsRow}>
                  <span>Вес:</span>
                  <span className={styles.totalValue}>{cartTotals.totalWeight} г</span>
                </div>
                <div className={styles.totalsRow}>
                  <span>Ккал:</span>
                  <span className={styles.totalValue}>{cartTotals.totalCalories}</span>
                </div>
                <div className={styles.totalsRow}>
                  <span>Белки:</span>
                  <span className={styles.totalValue}>{cartTotals.totalProtein} г</span>
                </div>
                <div className={styles.totalsRow}>
                  <span>Жиры:</span>
                  <span className={styles.totalValue}>{cartTotals.totalFat} г</span>
                </div>
                <div className={styles.totalsRow}>
                  <span>Углеводы:</span>
                  <span className={styles.totalValue}>{cartTotals.totalCarbs} г</span>
                </div>
                <div className={`${styles.totalsRow} ${styles.totalPriceRow}`}>
                  <span>Итого:</span>
                  <span className={styles.totalPrice}>{cartTotals.totalPrice} ₽</span>
                </div>
              </div>

              <button
                className={styles.clearButton}
                onClick={clearCart}
              >
                Очистить корзину
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
