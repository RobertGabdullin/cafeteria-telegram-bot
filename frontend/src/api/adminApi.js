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

export async function suggestNamespaces(query) {
  if (!query || query.trim().length === 0) {
    return { suggestions: [] };
  }

  const response = await fetch(
    `${API_BASE}/namespaces/suggest?q=${encodeURIComponent(query)}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    return { suggestions: [] };
  }

  return response.json();
}

export async function checkNamespace(namespace) {
  if (!namespace || namespace.trim().length === 0) {
    return { exists: false, namespace: "" };
  }

  const response = await fetch(
    `${API_BASE}/namespaces/check?namespace=${encodeURIComponent(namespace)}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    return { exists: false, namespace };
  }

  return response.json();
}
