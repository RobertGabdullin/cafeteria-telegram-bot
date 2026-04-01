import React from 'react';
import './Sidebar.css';

const tabs = [
  { key: 'menu', label: 'Опубликовать меню', icon: '📋' },
  { key: 'dish', label: 'Создать блюдо', icon: '🍽️' },
];

export default function Sidebar({ activeTab, onTabChange, namespace }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">🍴</span>
          <span className="sidebar__logo-text">MenuHub</span>
        </div>
        <div className="sidebar__namespace">
          <span className="sidebar__namespace-label">Namespace</span>
          <span className="sidebar__namespace-value">{namespace}</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`sidebar__tab ${activeTab === tab.key ? 'sidebar__tab--active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <span className="sidebar__tab-icon">{tab.icon}</span>
            <span className="sidebar__tab-label">{tab.label}</span>
            {activeTab === tab.key && <div className="sidebar__tab-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__decoration">
          <div className="sidebar__dot sidebar__dot--1" />
          <div className="sidebar__dot sidebar__dot--2" />
          <div className="sidebar__dot sidebar__dot--3" />
        </div>
        <span className="sidebar__version">v0.1.0 — mock mode</span>
      </div>
    </aside>
  );
}