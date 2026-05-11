import styles from "./CompositionTooltip.module.css";

export default function CompositionTooltip({ composition }) {
  return (
    <div className={styles.composition}>
      <div className={styles.compositionLabel}>Состав</div>
      <div className={styles.compositionText}>{composition}</div>
    </div>
  );
}
