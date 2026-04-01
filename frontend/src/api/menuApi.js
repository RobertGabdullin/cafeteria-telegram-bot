const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const menuApi = {
  /**
   * Опубликовать меню
   * TODO: заменить на реальный POST /api/namespaces/:ns/menu
   */
  async publish(namespace, menuData) {
    await delay(700);
    console.log(`[MOCK] Publishing menu for namespace "${namespace}":`, menuData);
    return { success: true, id: Date.now().toString() };
  },
};