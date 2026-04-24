const API_BASE_URL = "/api";

export async function fetchMenu(namespace = "cafeteria-main") {
  const response = await fetch(`${API_BASE_URL}/menu/${namespace}`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить меню");
  }
  return response.json();
}