import { useState } from "react";
import styles from "./TrayAssembly.module.css";

export default function TrayAssembly({ onTraySelect }) {
  const [prompt, setPrompt] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = async () => {
    if (!prompt.trim()) return;
    
    setIsSelecting(true);
    
    // Заглушка: всегда выделяем определенные блюда независимо от промпта
    // В будущем здесь будет вызов API для подбора блюд по промпту
    const mockSelectedDishIds = [1, 3, 5]; // ID блюд для заглушки
    
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (onTraySelect) {
      onTraySelect(mockSelectedDishIds);
    }
    
    setIsSelecting(false);
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
