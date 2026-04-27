const API_BASE = "/api/admin";

export async function uploadMenu({ file, namespace, date }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("namespace", namespace);
  formData.append("date", date);

  const response = await fetch(`${API_BASE}/upload-menu`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка загрузки");
  }

  return response.json();
}