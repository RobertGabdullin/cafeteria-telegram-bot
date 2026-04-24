import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.logo}>🍽️</div>
          <h1 className={styles.title}>Цифровое меню</h1>
          <p className={styles.subtitle}>
            Удобный способ посмотреть актуальное меню вашей точки питания —
            прямо с телефона, без очередей и ожидания
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📋</div>
            <div className={styles.featureTitle}>Актуальное меню</div>
            <div className={styles.featureText}>
              Список блюд обновляется каждый день — вы всегда видите только то,
              что доступно сейчас
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔍</div>
            <div className={styles.featureTitle}>Удобные фильтры</div>
            <div className={styles.featureText}>
              Подберите блюда по цене, калориям и содержанию белков, жиров и
              углеводов
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🥬</div>
            <div className={styles.featureTitle}>Состав и БЖУ</div>
            <div className={styles.featureText}>
              У каждого блюда — подробный состав, вес и пищевая ценность
            </div>
          </div>
        </div>

        <div className={styles.howTo}>
          <div className={styles.howToTitle}>Как открыть меню вашей точки</div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Найдите QR-код</div>
                <div className={styles.stepText}>
                  QR-код с ссылкой на меню можно получить у сотрудников
                  кафетерия — просто подойдите и попросите
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Отсканируйте его</div>
                <div className={styles.stepText}>
                  Наведите камеру телефона на QR-код — он откроет меню именно
                  вашей точки питания
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Выбирайте блюда</div>
                <div className={styles.stepText}>
                  Используйте фильтры и категории, чтобы быстро найти то, что
                  вам по вкусу
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          Меню обновляется ежедневно сотрудниками каждой точки питания
        </div>
      </div>
    </div>
  );
}