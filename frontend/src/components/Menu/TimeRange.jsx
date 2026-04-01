import React from 'react';
import { useMenu } from '../../store/MenuContext';
import DishSearch from './DishSearch';
import DishCard from './DishCard';
import Button from '../UI/Button';
import './TimeRange.css';

export default function TimeRange({ range }) {
  const { updateTimeRange, removeTimeRange, addDishToRange, removeDishFromRange } = useMenu();
  const excludeIds = range.dishes.map((d) => d.id);

  return (
    <div className="time-range">
      <div className="time-range__header">
        <div className="time-range__times">
          <label className="time-range__label">
            <span>С</span>
            <input
              type="time"
              className="time-range__time-input"
              value={range.from}
              onChange={(e) => updateTimeRange(range.id, 'from', e.target.value)}
            />
          </label>
          <span className="time-range__separator">—</span>
          <label className="time-range__label">
            <span>До</span>
            <input
              type="time"
              className="time-range__time-input"
              value={range.to}
              onChange={(e) => updateTimeRange(range.id, 'to', e.target.value)}
            />
          </label>
        </div>
        <Button variant="danger" size="small" onClick={() => removeTimeRange(range.id)}>
          Удалить диапазон
        </Button>
      </div>

      <div className="time-range__dishes">
        {range.dishes.length === 0 && (
          <p className="time-range__empty">Блюда ещё не добавлены. Найдите блюдо ниже 👇</p>
        )}
        {range.dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onRemove={(dishId) => removeDishFromRange(range.id, dishId)}
          />
        ))}
      </div>

      <div className="time-range__search">
        <DishSearch
          onSelect={(dish) => addDishToRange(range.id, dish)}
          excludeIds={excludeIds}
        />
      </div>
    </div>
  );
}