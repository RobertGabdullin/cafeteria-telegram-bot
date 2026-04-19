import { useState, useEffect, useCallback } from "react";
import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition }) {
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  // Закрытие при скролле (мобильные)
  useEffect(() => {
    if (!visible) return;

    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [visible, close]);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className={styles.icon}
        onClick={() => setVisible((v) => !v)}
      >
        i
      </div>
      {visible && (
        <>
          <div className={styles.overlay} onClick={close} />
          <div className={styles.tooltip}>
            <div className={styles.tooltipLabel}>Состав</div>
            {composition}
          </div>
        </>
      )}
    </div>
  );
}