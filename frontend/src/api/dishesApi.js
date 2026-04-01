import { mockDishes } from '../utils/mockData';

// Имитация задержки сети
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let localDishes = [...mockDishes];

export const dishesApi = {
  /**
   * Получить все блюда
   * TODO: заменить на реальный GET /api/dishes
   */
  async fetchAll() {
    await delay(300);
    return [...localDishes];
  },

  /**
   * Создать новое блюдо
   * TODO: заменить на реальный POST /api/dishes
   */
  async create(dishData) {
    await delay(500);
    const newDish = {
      ...dishData,
      id: Date.now().toString(),
    };
    localDishes.push(newDish);
    return newDish;
  },

  /**
   * Поиск блюд по названию
   * TODO: заменить на реальный GET /api/dishes?search=query
   */
  async search(query) {
    await delay(200);
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return localDishes.filter((d) =>
      d.name.toLowerCase().includes(lower)
    );
  },
};