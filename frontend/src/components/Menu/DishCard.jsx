import React from 'react';
import Button from '../UI/Button';
import './DishCard.css';

export default function DishCard({ dish, onRemove }) {
  return (
    <div className="dish-card">
      <div className="dish-card__header">
        <h4 className="dish-card__name">{dish.name}</h4>
        {onRemove && (
          <Button variant="danger" size="small" onClick={() => onRemove(dish.id)}>
            ✕
          </Button>
        )}
      </div>

      <p className="dish-card__composition">
        <span className="dish-card__label">Состав:</span> {dish.composition}
      </p>

      <div className="dish-card__stats">
        <div className="dish-card__stat">
          <span className="dish-card__stat-value">{dish.calories}</span>
          <span className="dish-card__stat-label">ккал</span>
        </div>
        <div className="dish-card__stat">
          <span className="dish-card__stat-value">{dish.proteins}г</span>
          <span className="dish-card__stat-label">белки</span>
        </div>
        <div className="dish-card__stat">
          <span className="dish-card__stat-value">{dish.fats}г</span>
          <span className="dish-card__stat-label">жиры</span>
        </div>
        <div className="dish-card__stat">
          <span className="dish-card__stat-value">{dish.carbs}г</span>
          <span className="dish-card__stat-label">углеводы</span>
        </div>
      </div>

      <div className="dish-card__footer">
        <span className="dish-card__price">{dish.price} ₽</span>
        <span className="dish-card__weight">{dish.weight} г</span>
      </div>
    </div>
  );
}