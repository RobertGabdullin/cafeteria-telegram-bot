import React, { useState } from 'react';
import { useDishes } from '../../store/DishesContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './CreateDishForm.css';

const initialForm = {
  name: '',
  composition: '',
  calories: '',
  proteins: '',
  fats: '',
  carbs: '',
  price: '',
  weight: '',
};

export default function CreateDishForm() {
  const { addDish, dishes } = useDishes();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Введите название';
    if (!form.composition.trim()) errs.composition = 'Введите состав';
    if (!form.calories || isNaN(form.calories)) errs.calories = 'Число';
    if (!form.proteins || isNaN(form.proteins)) errs.proteins = 'Число';
    if (!form.fats || isNaN(form.fats)) errs.fats = 'Число';
    if (!form.carbs || isNaN(form.carbs)) errs.carbs = 'Число';
    if (!form.price || isNaN(form.price)) errs.price = 'Число';
    if (!form.weight || isNaN(form.weight)) errs.weight = 'Число';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      await addDish({
        name: form.name.trim(),
        composition: form.composition.trim(),
        calories: parseFloat(form.calories),
        proteins: parseFloat(form.proteins),
        fats: parseFloat(form.fats),
        carbs: parseFloat(form.carbs),
        price: parseFloat(form.price),
        weight: parseFloat(form.weight),
      });
      setForm(initialForm);
      setSuccessMsg(`Блюдо «${form.name.trim()}» добавлено!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-dish">
      <div className="create-dish__title-section">
        <h2 className="create-dish__title">🍽️ Создать блюдо</h2>
        <p className="create-dish__subtitle">
          Добавьте новое блюдо в базу. Оно станет доступно для поиска при публикации меню.
        </p>
      </div>

      <form className="create-dish__form" onSubmit={handleSubmit}>
        <Input
          label="Название блюда"
          placeholder="Например: Борщ классический"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
        />

        <div className="create-dish__field-full">
          <label className="input-label">Состав</label>
          <textarea
            className={`create-dish__textarea ${errors.composition ? 'input-field--error' : ''}`}
            placeholder="Перечислите ингредиенты через запятую..."
            value={form.composition}
            onChange={handleChange('composition')}
            rows={3}
          />
          {errors.composition && <span className="input-error">{errors.composition}</span>}
        </div>

        <div className="create-dish__row">
          <Input
            label="Калории (ккал)"
            type="number"
            placeholder="120"
            value={form.calories}
            onChange={handleChange('calories')}
            error={errors.calories}
          />
          <Input
            label="Белки (г)"
            type="number"
            placeholder="8.5"
            value={form.proteins}
            onChange={handleChange('proteins')}
            error={errors.proteins}
          />
          <Input
            label="Жиры (г)"
            type="number"
            placeholder="4.2"
            value={form.fats}
            onChange={handleChange('fats')}
            error={errors.fats}
          />
          <Input
            label="Углеводы (г)"
            type="number"
            placeholder="12.3"
            value={form.carbs}
            onChange={handleChange('carbs')}
            error={errors.carbs}
          />
        </div>

        <div className="create-dish__row create-dish__row--half">
          <Input
            label="Цена (₽)"
            type="number"
            placeholder="350"
            value={form.price}
            onChange={handleChange('price')}
            error={errors.price}
          />
          <Input
            label="Вес (г)"
            type="number"
            placeholder="350"
            value={form.weight}
            onChange={handleChange('weight')}
            error={errors.weight}
          />
        </div>

        <Button type="submit" variant="primary" size="large" disabled={saving}>
          {saving ? 'Сохранение...' : '💾 Сохранить блюдо'}
        </Button>
      </form>

      {successMsg && (
        <div className="create-dish__success">✅ {successMsg}</div>
      )}

      {/* Список уже добавленных блюд */}
      {dishes.length > 0 && (
        <div className="create-dish__list">
          <h3 className="create-dish__list-title">Блюда в базе ({dishes.length})</h3>
          <div className="create-dish__list-items">
            {dishes.map((d) => (
              <div key={d.id} className="create-dish__list-item">
                <span className="create-dish__list-item-name">{d.name}</span>
                <span className="create-dish__list-item-info">
                  {d.calories} ккал · {d.price} ₽ · {d.weight} г
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}