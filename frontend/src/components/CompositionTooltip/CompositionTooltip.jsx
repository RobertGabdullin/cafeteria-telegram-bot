import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition }) {
  const [visible, setVisible] = useState(false);
  const touchHandled = useRef(false);

  const close = useCallback(() => {
    setVisible(false);
    touchHandled.current = false;
  }, []);

  // Закрытие при скролле (мобильные)
  useEffect(() => {
    if (!visible) return;

    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [visible, close]);

  const handleTouchStart = (e) => {
    e.preventDefault();
    setVisible(true);
    touchHandled.current = true;
  };

  const handleClick = () => {
    setVisible((v) => !v);
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div
        className={styles.icon}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      >
        i
      </div>
      {visible && (
        <>
          <div className={styles.overlay} onClick={close} onTouchStart={close} />
          <div className={styles.tooltip}>
            <div className={styles.tooltipLabel}>Состав</div>
            {composition}
          </div>
        </>
      )}
    </div>
  );
}
