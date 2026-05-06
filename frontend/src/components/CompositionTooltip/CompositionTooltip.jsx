import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition }) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  // Закрытие при скролле (мобильные)
  useEffect(() => {
    if (!visible) return;
    const handleScroll = () => setVisible(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  // Закрытие по клику вне компонента
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        return;
      }
      setVisible(false);
    };

    // Используем capture phase чтобы обработать клик раньше чем он дойдет до карточки
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, [visible]);

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((v) => !v);
  };

  const handleTooltipClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    setVisible(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className={styles.icon}
        onClick={handleIconClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVisible((v) => !v);
        }}
      >
        i
      </div>
      {visible && (
        <>
          <div className={styles.overlay} onClick={handleOverlayClick} onTouchEnd={handleOverlayClick} />
          <div className={styles.tooltip} onClick={handleTooltipClick}>
            <div className={styles.tooltipLabel}>Состав</div>
            {composition}
          </div>
        </>
      )}
    </div>
  );
}
