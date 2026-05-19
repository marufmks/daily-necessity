const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiError extends Error {
  constructor(status, body) {
    super(typeof body?.message === "string" ? body.message : "Request failed");
    this.status = status;
    this.body = body;
  }
}

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 204) return null;

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, body);
  }

  return body;
}

export const api = {
  get: (url) => request(url),
  post: (url, data) => request(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: "DELETE" }),
};
