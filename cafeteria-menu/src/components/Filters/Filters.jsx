import { useState, useRef, useCallback } from "react";
import styles from "./Filters.module.css";

function RangeFilter({ label, value, min, max, step = 1, unit = "", onChange }) {
  const displayValue = value === null || value === undefined ? max : value;

  return (
    <div className={styles.sliderGroup}>
      <div className={styles.rangeHeader}>
        <span className={styles.rangeLabel}>{label}</span>
        <span className={styles.rangeValue}>
          {displayValue === max ? `до ${max}` : `≤ ${displayValue}`}
          {unit && ` ${unit}`}
        </span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function DualRangeFilter({ label, valueMin, valueMax, min, max, step = 10, unit = "₽", onChangeMin, onChangeMax }) {
  const trackRef = useRef(null);

  const getPercent = useCallback(
    (value) => ((value - min) / (max - min)) * 100,
    [min, max]
  );

  const leftPercent = getPercent(valueMin);
  const rightPercent = getPercent(valueMax);

  return (
    <div className={styles.sliderGroup}>
      <div className={styles.rangeHeader}>
        <span className={styles.rangeLabel}>{label}</span>
        <span className={styles.rangeValue}>
          {valueMin} — {valueMax} {unit}
        </span>
      </div>
      <div className={styles.dualRange} ref={trackRef}>
        <div
          className={styles.dualRangeTrack}
        />
        <div
          className={styles.dualRangeActive}
          style={{
            left: `${leftPercent}%`,
            width: `${rightPercent - leftPercent}%`,
          }}
        />
        <input
          type="range"
          className={styles.dualRangeInput}
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChangeMin(Math.min(v, valueMax - step));
          }}
        />
        <input
          type="range"
          className={styles.dualRangeInput}
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChangeMax(Math.max(v, valueMin + step));
          }}
        />
      </div>
    </div>
  );
}

export default function Filters({
  filters,
  ranges,
  onUpdateFilter,
  onReset,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.sidebar}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>⚙️ Фильтры</span>
        <span className={`${styles.toggleArrow} ${isOpen ? styles.toggleArrowOpen : ""}`}>
          ▼
        </span>
      </button>

      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ""}`}>
        <div className={styles.title}>
          <span className={styles.titleIcon}>⚙️</span>
          Фильтры
        </div>

        <div className={styles.group}>
          <div className={styles.groupLabel}>Цена</div>
          <DualRangeFilter
            label="Диапазон"
            valueMin={filters.priceMin}
            valueMax={filters.priceMax}
            min={ranges.priceMin}
            max={ranges.priceMax}
            step={10}
            unit="₽"
            onChangeMin={(v) => onUpdateFilter("priceMin", v)}
            onChangeMax={(v) => onUpdateFilter("priceMax", v)}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <div className={styles.groupLabel}>Пищевая ценность</div>
          <RangeFilter
            label="Калории"
            value={filters.caloriesMax}
            min={0}
            max={ranges.caloriesMax}
            step={10}
            unit="ккал"
            onChange={(v) =>
              onUpdateFilter("caloriesMax", v === ranges.caloriesMax ? null : v)
            }
          />
          <RangeFilter
            label="Белки (мин)"
            value={filters.proteinMin}
            min={0}
            max={ranges.proteinMax}
            step={1}
            unit="г"
            onChange={(v) => onUpdateFilter("proteinMin", v === 0 ? null : v)}
          />
          <RangeFilter
            label="Жиры"
            value={filters.fatMax}
            min={0}
            max={ranges.fatMax}
            step={1}
            unit="г"
            onChange={(v) =>
              onUpdateFilter("fatMax", v === ranges.fatMax ? null : v)
            }
          />
          <RangeFilter
            label="Углеводы"
            value={filters.carbsMax}
            min={0}
            max={ranges.carbsMax}
            step={1}
            unit="г"
            onChange={(v) =>
              onUpdateFilter("carbsMax", v === ranges.carbsMax ? null : v)
            }
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <div className={styles.groupLabel}>Дополнительно</div>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={filters.dietaryOnly}
              onChange={(e) => onUpdateFilter("dietaryOnly", e.target.checked)}
            />
            <span className={styles.checkboxLabel}>
              <span className={styles.dietaryIcon}>🥬</span>
              Только диетические
            </span>
          </label>
        </div>

        <button className={styles.resetButton} onClick={onReset}>
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}