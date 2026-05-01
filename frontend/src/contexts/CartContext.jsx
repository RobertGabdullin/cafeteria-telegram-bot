import { createContext, useContext, useState, useCallback, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Добавление/удаление блюда из корзины
  const toggleDish = useCallback((dish) => {
    setSelectedDishes((prev) => {
      const exists = prev.find((d) => d.id === dish.id);
      if (exists) {
        return prev.filter((d) => d.id !== dish.id);
      } else {
        return [...prev, dish];
      }
    });
  }, []);

  // Проверка, выбрано ли блюдо
  const isDishSelected = useCallback((dishId) => {
    return selectedDishes.some((d) => d.id === dishId);
  }, [selectedDishes]);

  // Выбор блюда из бизнес-ланча (только одно из категории)
  const toggleBusinessLunchDish = useCallback((dish, blPrice) => {
    setSelectedDishes((prev) => {
      const exists = prev.find((d) => d.id === dish.id);
      if (exists) {
        return prev.filter((d) => d.id !== dish.id);
      } else {
        // Удаляем другие блюда из той же категории бизнес-ланча
        const filtered = prev.filter((d) => 
          !d.isBusinessLunch || d.category !== dish.category
        );
        return [...filtered, dish];
      }
    });
  }, []);

  // Очистка корзины
  const clearCart = useCallback(() => {
    setSelectedDishes([]);
  }, []);

  // Подсчет итогов
  const cartTotals = useMemo(() => {
    if (selectedDishes.length === 0) {
      return {
        totalPrice: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalWeight: 0,
        itemCount: 0,
      };
    }

    let totalPrice = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalWeight = 0;

    const hasBusinessLunch = selectedDishes.some((d) => d.isBusinessLunch);
    let businessLunchAdded = false;

    selectedDishes.forEach((dish) => {
      totalCalories += dish.calories || 0;
      totalProtein += dish.protein || 0;
      totalFat += dish.fat || 0;
      totalCarbs += dish.carbs || 0;
      totalWeight += dish.weight || 0;

      if (dish.isBusinessLunch) {
        if (!businessLunchAdded) {
          totalPrice += dish.businessLunchPrice || 350;
          businessLunchAdded = true;
        }
      } else {
        totalPrice += dish.price || 0;
      }
    });

    return {
      totalPrice,
      totalCalories,
      totalProtein,
      totalFat,
      totalCarbs,
      totalWeight,
      itemCount: selectedDishes.length,
    };
  }, [selectedDishes]);

  const value = {
    selectedDishes,
    isCartOpen,
    setIsCartOpen,
    toggleDish,
    toggleBusinessLunchDish,
    isDishSelected,
    clearCart,
    cartTotals,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
