import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition }) {
  const [visible, setVisible] = useState(false);
  const touchHandled = useRef(false);
  const touchTimeout = useRef(null);

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

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    };
  }, []);

  const handleTouchStart = (e) => {
    e.preventDefault();
    touchHandled.current = true;
    setVisible((v) => !v);
    
    // Сбрасываем флаг через 300мс, чтобы следующий клик работал
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
    }
    touchTimeout.current = setTimeout(() => {
      touchHandled.current = false;
    }, 300);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    // Игнорируем клик, если он был вызван после touch события
    if (touchHandled.current) {
      return;
    }
    setVisible((v) => !v);
  };

  const handleTooltipClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    close();
    return false;
  };

  const handleWrapperClick = (e) => {
    e.stopPropagation();
    handleClick(e);
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={handleTouchStart}
      onClick={handleWrapperClick}
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
          <div className={styles.overlay} onClick={handleOverlayClick} onTouchStart={handleOverlayClick} />
          <div className={styles.tooltip} onClick={handleTooltipClick} onTouchStart={handleTooltipClick}>
            <div className={styles.tooltipLabel}>Состав</div>
            {composition}
          </div>
        </>
      )}
    </div>
  );
}
