import { api } from "./client";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  me: () => api.get("/auth/me"),
};

export const categoryApi = {
  list: () => api.get("/categories"),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const productApi = {
  list: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/products${q ? `?${q}` : ""}`);
  },
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const cartApi = {
  list: () => api.get("/cart"),
  add: (data) => api.post("/cart", data),
  update: (itemId, data) => api.put(`/cart/${itemId}`, data),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
};

export const addressApi = {
  list: () => api.get("/addresses"),
  create: (data) => api.post("/addresses", data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  remove: (id) => api.delete(`/addresses/${id}`),
};

export const orderApi = {
  create: (data) => api.post("/orders", data),
  list: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  listAll: () => api.get("/orders/admin"),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const paymentApi = {
  create: (data) => api.post("/payments", data),
};

export const userApi = {
  list: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};
