const API_BASE_URL = "/api";

export async function fetchMenu(namespace = "cafeteria-main") {
  const response = await fetch(`${API_BASE_URL}/menu/${namespace}`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить меню");
  }
  return response.json();
}

export async function suggestTrayDishes({ namespace, prompt, timeRange }) {
  const formData = new FormData();
  formData.append("user_prompt", prompt);
  formData.append("namespace", namespace);
  if (timeRange) {
    formData.append("time_range", timeRange);
  }

  const response = await fetch(`${API_BASE_URL}/admin/tray-suggest`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка подбора блюд");
  }

  return response.json();
}
