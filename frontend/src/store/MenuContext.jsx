import React, { createContext, useContext, useState, useCallback } from 'react';
import { menuApi } from '../api/menuApi';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  // Структура: { date: string, timeRanges: [{ id, from, to, dishes: [...] }] }
  const [menuDraft, setMenuDraft] = useState({
    date: '',
    timeRanges: [],
  });
  const [publishing, setPublishing] = useState(false);

  const setDate = useCallback((date) => {
    setMenuDraft((prev) => ({ ...prev, date }));
  }, []);

  const addTimeRange = useCallback(() => {
    setMenuDraft((prev) => ({
      ...prev,
      timeRanges: [
        ...prev.timeRanges,
        { id: Date.now().toString(), from: '09:00', to: '12:00', dishes: [] },
      ],
    }));
  }, []);

  const updateTimeRange = useCallback((rangeId, field, value) => {
    setMenuDraft((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.map((r) =>
        r.id === rangeId ? { ...r, [field]: value } : r
      ),
    }));
  }, []);

  const removeTimeRange = useCallback((rangeId) => {
    setMenuDraft((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.filter((r) => r.id !== rangeId),
    }));
  }, []);

  const addDishToRange = useCallback((rangeId, dish) => {
    setMenuDraft((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.map((r) => {
        if (r.id !== rangeId) return r;
        // Не добавляем дубликаты
        if (r.dishes.some((d) => d.id === dish.id)) return r;
        return { ...r, dishes: [...r.dishes, dish] };
      }),
    }));
  }, []);

  const removeDishFromRange = useCallback((rangeId, dishId) => {
    setMenuDraft((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.map((r) => {
        if (r.id !== rangeId) return r;
        return { ...r, dishes: r.dishes.filter((d) => d.id !== dishId) };
      }),
    }));
  }, []);

  const publishMenu = useCallback(async (namespace) => {
    setPublishing(true);
    try {
      const result = await menuApi.publish(namespace, menuDraft);
      if (result.success) {
        setMenuDraft({ date: '', timeRanges: [] });
      }
      return result;
    } finally {
      setPublishing(false);
    }
  }, [menuDraft]);

  const resetMenu = useCallback(() => {
    setMenuDraft({ date: '', timeRanges: [] });
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuDraft,
        publishing,
        setDate,
        addTimeRange,
        updateTimeRange,
        removeTimeRange,
        addDishToRange,
        removeDishFromRange,
        publishMenu,
        resetMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}