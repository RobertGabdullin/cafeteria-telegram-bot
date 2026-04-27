const API_BASE = "/api/auth";

export async function login(loginName, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ login: loginName, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка входа");
  }

  return response.json();
}

export async function logout() {
  await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE}/me`, {
    credentials: "include",
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Ошибка проверки авторизации");

  return response.json();
}