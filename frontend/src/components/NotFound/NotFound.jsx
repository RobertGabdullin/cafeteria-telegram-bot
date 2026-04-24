import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>🍽️</div>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.message}>
        Возможно, вы перешли по неверной ссылке или меню для этой точки ещё не загружено.
      </p>
      <p className={styles.hint}>
        Проверьте адрес или обратитесь к администратору
      </p>
      <Link to="/menu/cafeteria-main" className={styles.link}>
        ☕ На главную
      </Link>
    </div>
  );
}