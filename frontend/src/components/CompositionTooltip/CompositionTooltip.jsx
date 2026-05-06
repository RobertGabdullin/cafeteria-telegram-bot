import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition, onBlockClicks }) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);
  const blockTimeoutRef = useRef(null);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  // Функция для блокировки кликов на 0.3 секунды
  const blockClicksFor300ms = useCallback(() => {
    if (onBlockClicks) {
      onBlockClicks();
    }
  }, [onBlockClicks]);

  // Закрытие при скролле (мобильные)
  useEffect(() => {
    if (!visible) return;
    const handleScroll = () => setVisible(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  // Закрытие по клику вне компонента (только для десктопа)
  useEffect(() => {
    if (!visible) return;
    if (window.innerWidth <= 768) return; // На мобильных используем только overlay

    const handleClickOutside = (e) => {
      // Если клик был по overlay - уже обработано, ничего не делаем
      if (e.target.classList.contains(styles.overlay)) {
        return;
      }
      // Если клик внутри компонента - игнорируем
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        return;
      }
      // Иначе закрываем tooltip
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
    e.stopImmediatePropagation();
    e.preventDefault();
    setVisible(false);
    blockClicksFor300ms();
    return false;
  };

  const handleOverlayTouchStart = (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (blockTimeoutRef.current) {
        clearTimeout(blockTimeoutRef.current);
      }
    };
  }, []);

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
          <div 
            className={styles.overlay} 
            onClick={handleOverlayClick} 
            onTouchEnd={handleOverlayClick}
            onTouchStart={handleOverlayTouchStart}
          />
          <div className={styles.tooltip} onClick={handleTooltipClick}>
            <div className={styles.tooltipLabel}>Состав</div>
            {composition}
          </div>
        </>
      )}
    </div>
  );
}
