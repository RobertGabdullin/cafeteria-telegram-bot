import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import './NamespaceEntryPage.css';

export default function NamespaceEntryPage() {
  const [namespace, setNamespace] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = namespace.trim();
    if (trimmed) {
      navigate(`/upload/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="ns-entry">
      {/* Декоративный фон */}
      <div className="ns-entry__bg">
        <div className="ns-entry__orb ns-entry__orb--1" />
        <div className="ns-entry__orb ns-entry__orb--2" />
        <div className="ns-entry__orb ns-entry__orb--3" />
        <div className="ns-entry__grid" />
      </div>

      <div className="ns-entry__card">
        <div className="ns-entry__logo">
          <span className="ns-entry__logo-emoji">🍴</span>
          <h1 className="ns-entry__logo-text">MenuHub</h1>
        </div>

        <p className="ns-entry__description">
          Управляйте меню ресторана.<br />
          Введите namespace, чтобы начать работу.
        </p>

        <form className="ns-entry__form" onSubmit={handleSubmit}>
          <div className="ns-entry__input-wrapper">
            <input
              className="ns-entry__input"
              type="text"
              placeholder="Введите namespace..."
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!namespace.trim()}
            className="ns-entry__btn"
          >
            Войти →
          </Button>
        </form>

        <div className="ns-entry__hints">
          <span className="ns-entry__hint">Например: <code>restaurant-1</code></span>
        </div>
      </div>
    </div>
  );
}