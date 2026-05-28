import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { uploadMenu, suggestNamespaces, checkNamespace } from "../../api/adminApi";
import Header from "../Header/Header";
import styles from "./AdminUpload.module.css";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminUpload() {
  const { user, logout } = useAuth();
  const inputRef = useRef(null);

  const [namespace, setNamespace] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [namespaceExists, setNamespaceExists] = useState(null);
  const [showNamespaceCheck, setShowNamespaceCheck] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Debounced search for namespace suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isTyping && namespace.trim().length >= 1) {
        try {
          const result = await suggestNamespaces(namespace);
          setSuggestions(result.suggestions || []);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [namespace, isTyping]);

  // Check if namespace exists (only when showNamespaceCheck is true)
  useEffect(() => {
    if (!showNamespaceCheck || namespace.trim().length === 0) {
      return;
    }
    
    const timer = setTimeout(async () => {
      try {
        const result = await checkNamespace(namespace);
        setNamespaceExists(result.exists);
      } catch {
        setNamespaceExists(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [namespace, showNamespaceCheck]);

  function handleSuggestionClick(suggestion) {
    setNamespace(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsTyping(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleNamespaceChange(e) {
    setNamespace(e.target.value);
    setIsTyping(true);
  }

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
      <Header>
        <div className={styles.userInfo}>
          Вы вошли как <span className={styles.userName}>{user?.login}</span>
        </div>
        <button className={styles.logoutButton} onClick={logout}>
          Выйти
        </button>
      </Header>

      <div className={styles.card}>
        <div className={styles.title}>Загрузка меню</div>
        <div className={styles.subtitle}>
          Выберите JSON файл с меню, укажите точку и дату
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field} style={{ position: "relative" }}>
            <label className={styles.label}>Namespace (идентификатор точки)</label>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="cafeteria-main"
              value={namespace}
              onChange={handleNamespaceChange}
              onFocus={() => isTyping && namespace.trim().length >= 1 && setShowSuggestions(true)}
              onBlur={() => {
                setShowSuggestions(false);
                setShowNamespaceCheck(true);
              }}
              disabled={submitting}
              required
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className={styles.suggestionItem}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            {namespaceExists === false && (
              <div className={styles.newNamespaceMessage}>Будет создан новый идентификатор</div>
            )}
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
            <label className={styles.label}>JSON файл</label>
            <label
              className={`${styles.fileLabel} ${file ? styles.fileLabelActive : ""}`}
            >
              <input
                className={styles.fileInput}
                type="file"
                accept="application/json"
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
                  <>Нажмите чтобы выбрать JSON</>
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
