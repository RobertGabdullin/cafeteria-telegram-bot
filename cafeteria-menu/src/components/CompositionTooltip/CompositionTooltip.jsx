import { useState } from "react";
import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div className={styles.icon}>i</div>
      {visible && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>Состав</div>
          {composition}
        </div>
      )}
    </div>
  );
}