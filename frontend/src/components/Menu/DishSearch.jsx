import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDishes } from '../../store/DishesContext';
import './DishSearch.css';

export default function DishSearch({ onSelect, excludeIds = [] }) {
  const { searchDishes } = useDishes();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const found = await searchDishes(q);
      const filtered = found.filter((d) => !excludeIds.includes(d.id));
      setResults(filtered);
      setIsOpen(filtered.length > 0);
    } finally {
      setLoading(false);
    }
  }, [searchDishes, excludeIds]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  // Закрытие по клику вне
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (dish) => {
    onSelect(dish);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="dish-search" ref={wrapperRef}>
      <div className="dish-search__input-wrapper">
        <span className="dish-search__icon">🔍</span>
        <input
          className="dish-search__input"
          type="text"
          placeholder="Найти блюдо по названию..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {loading && <span className="dish-search__spinner" />}
      </div>

      {isOpen && (
        <ul className="dish-search__dropdown">
          {results.map((dish) => (
            <li
              key={dish.id}
              className="dish-search__item"
              onClick={() => handleSelect(dish)}
            >
              <span className="dish-search__item-name">{dish.name}</span>
              <span className="dish-search__item-price">{dish.price} ₽</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}