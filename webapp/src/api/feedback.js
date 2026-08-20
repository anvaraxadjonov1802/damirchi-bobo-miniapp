const DEFAULT_BACKEND_URL = import.meta.env.PROD
  ? "https://damirchi-bobo-api.onrender.com"
  : "http://127.0.0.1:8000";

function getApiUrl() {
  const value = String(import.meta.env.VITE_API_URL || `${DEFAULT_BACKEND_URL}/api`)
    .replace(/\/+$/, "");
  return value.endsWith("/api") ? value : `${value}/api`;
}

export async function submitFeedback(payload) {
  const response = await fetch(`${getApiUrl()}/feedback/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const firstFieldError = data && typeof data === "object"
      ? Object.values(data).flat().find(Boolean)
      : null;
    throw new Error(
      data?.detail ||
      data?.message ||
      firstFieldError ||
      "Fikrni yuborishda xatolik yuz berdi."
    );
  }

  return data;
}
