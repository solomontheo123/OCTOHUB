const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
    ...options.headers,
  };

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      "Request failed"
    );
  }

  return data;
}