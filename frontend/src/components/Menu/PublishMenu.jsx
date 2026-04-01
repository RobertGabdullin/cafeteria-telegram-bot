import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMenu } from '../../store/MenuContext';
import TimeRange from './TimeRange';
import Button from '../UI/Button';
import './PublishMenu.css';

export default function PublishMenu() {
  const { namespace } = useParams();
  const { menuDraft, setDate, addTimeRange, publishMenu, publishing, resetMenu } = useMenu();
  const [successMsg, setSuccessMsg] = useState('');

  const handlePublish = async () => {
    const result = await publishMenu(namespace);
    if (result?.success) {
      setSuccessMsg('Меню успешно опубликовано!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const hasDate = !!menuDraft.date;
  const hasDishes = menuDraft.timeRanges.some((r) => r.dishes.length > 0);

  return (
    <div className="publish-menu">
      <div className="publish-menu__title-section">
        <h2 className="publish-menu__title">📋 Опубликовать меню</h2>
        <p className="publish-menu__subtitle">
          Выберите дату, добавьте временные диапазоны и назначьте блюда
        </p>
      </div>

      {/* Выбор даты */}
      <div className="publish-menu__date-section">
        <label className="publish-menu__date-label">Дата меню</label>
        <input
          type="date"
          className="publish-menu__date-input"
          value={menuDraft.date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Временные диапазоны */}
      {hasDate && (
        <div className="publish-menu__ranges">
          {menuDraft.timeRanges.length === 0 && (
            <div className="publish-menu__empty-ranges">
              <span className="publish-menu__empty-icon">⏰</span>
              <p>Временных диапазонов пока нет</p>
              <p className="publish-menu__empty-hint">Добавьте первый диапазон, чтобы начать</p>
            </div>
          )}

          {menuDraft.timeRanges.map((range) => (
            <TimeRange key={range.id} range={range} />
          ))}

          <Button variant="secondary" onClick={addTimeRange} className="publish-menu__add-range-btn">
            + Добавить временной диапазон
          </Button>
        </div>
      )}

      {/* Кнопки */}
      {hasDate && menuDraft.timeRanges.length > 0 && (
        <div className="publish-menu__actions">
          <Button
            variant="success"
            size="large"
            disabled={!hasDishes || publishing}
            onClick={handlePublish}
          >
            {publishing ? 'Публикация...' : '🚀 Опубликовать меню'}
          </Button>
          <Button variant="ghost" onClick={resetMenu}>
            Очистить
          </Button>
        </div>
      )}

      {/* Сообщение об успехе */}
      {successMsg && (
        <div className="publish-menu__success">
          ✅ {successMsg}
        </div>
      )}
    </div>
  );
}