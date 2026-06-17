import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { suggestTrayDishes } from "../../api/menuApi";
import styles from "./TrayAssembly.module.css";

export default function TrayAssembly({ onTraySelect, namespace, activeTimeRange }) {
  const [prompt, setPrompt] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSelect = async () => {
    if (!prompt.trim()) return;
    
    setIsSelecting(true);
    
    try {
      // Вызываем API для подбора блюд
      const result = await suggestTrayDishes({
        namespace,
        prompt,
        timeRange: activeTimeRange !== "all" ? activeTimeRange : null,
      });
      
      if (onTraySelect && result.suggested_dish_ids) {
        onTraySelect(result.suggested_dish_ids);
      }
    } catch (error) {
      console.error("Ошибка подбора блюд:", error);
      // В случае ошибки можно показать уведомление пользователю
    } finally {
      setIsSelecting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <div className={styles.trayAssembly}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>🍽️ Сбор подноса</span>
        <span className={`${styles.toggleArrow} ${isOpen ? styles.toggleArrowOpen : ""}`}>
          ▼
        </span>
      </button>

      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ""}`}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="Опишите, что вы хотите съесть"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
          />
<button
  className={`${styles.button} ${isSelecting ? styles.buttonLoading : ""}`}
  onClick={handleSelect}
  disabled={!prompt.trim() || isSelecting}
>
            {isSelecting ? (
              <>
                <span className={styles.spinner}></span>
                <span>Подбираем...</span>
              </>
            ) : (
              <>
                <span>🤖</span>
                <span>Подобрать блюда</span>
              </>
            )}
          </button>
        </div>
        
        <div className={styles.hint}>
          ИИ подберет блюда на основе вашего описания
        </div>
      </div>
    </div>
  );
}
