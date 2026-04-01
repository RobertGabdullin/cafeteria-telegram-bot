import React from 'react';
import './UI.css';

export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input-field ${error ? 'input-field--error' : ''}`}
        autoComplete="off"
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}