import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { uploadMenu } from "../../api/adminApi";
import styles from "./AdminUpload.module.css";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminUpload() {
  const { user, logout } = useAuth();

  const [namespace, setNamespace] = useState("");
  const [date, setDate] = useState(todayISO());
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const result = await uploadMenu({ file, namespace, date });
      setSuccess(
        `Меню успешно загружено для «${result.namespace}» на ${result.date}`
      );
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <div className={styles.userInfo}>
          Вы вошли как <span className={styles.userName}>{user?.login}</span>
        </div>
        <button className={styles.logoutButton} onClick={logout}>
          Выйти
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.title}>Загрузка меню</div>
        <div className={styles.subtitle}>
          Выберите PDF файл с меню, укажите точку и дату
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Namespace (идентификатор точки)</label>
            <input
              className={styles.input}
              type="text"
              placeholder="cafeteria-main"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Дата меню</label>
            <input
              className={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PDF файл</label>
            <label
              className={`${styles.fileLabel} ${file ? styles.fileLabelActive : ""}`}
            >
              <input
                className={styles.fileInput}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={submitting}
              />
              <div className={styles.fileIcon}>📄</div>
              <div className={styles.fileText}>
                {file ? (
                  <>
                    Выбран файл: <div className={styles.fileName}>{file.name}</div>
                  </>
                ) : (
                  <>Нажмите чтобы выбрать PDF</>
                )}
              </div>
            </label>
          </div>

          {error && <div className={styles.error}>❌ {error}</div>}
          {success && <div className={styles.success}>✅ {success}</div>}

          <button
            type="submit"
            className={styles.submit}
            disabled={submitting || !file || !namespace || !date}
          >
            {submitting ? "Загрузка..." : "Загрузить меню"}
          </button>
        </form>
      </div>
    </div>
  );
}