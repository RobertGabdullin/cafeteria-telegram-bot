import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dishesApi } from '../api/dishesApi';

const DishesContext = createContext(null);

export function DishesProvider({ children }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDishes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dishesApi.fetchAll();
      setDishes(data);
    } catch (err) {
      console.error('Failed to load dishes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const addDish = useCallback(async (dishData) => {
    const created = await dishesApi.create(dishData);
    setDishes((prev) => [...prev, created]);
    return created;
  }, []);

  const searchDishes = useCallback(async (query) => {
    return dishesApi.search(query);
  }, []);

  return (
    <DishesContext.Provider value={{ dishes, loading, addDish, searchDishes, loadDishes }}>
      {children}
    </DishesContext.Provider>
  );
}

export function useDishes() {
  const ctx = useContext(DishesContext);
  if (!ctx) throw new Error('useDishes must be used within DishesProvider');
  return ctx;
}