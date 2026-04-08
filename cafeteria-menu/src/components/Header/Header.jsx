import styles from "./Header.module.css";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Header({ date, timeRange }) {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.logoIcon}>☕</span>
        <div>
          <h1 className={styles.title}>Кафетерия</h1>
          <span className={styles.subtitle}>Цифровое меню</span>
        </div>
      </div>

      {date && timeRange && (
        <div className={styles.dateSection}>
          <span className={styles.date}>{formatDate(date)}</span>
          <span className={styles.timeRange}>
            <span className={styles.clockIcon}>🕐</span>
            {timeRange.from} — {timeRange.to}
          </span>
        </div>
      )}
    </header>
  );
}