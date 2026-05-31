import axios from "axios";

// 🔥 LIVE BACKEND URL (Render)
export const API_BASE = "https://portfolio-backend-ro4m.onrender.com";

// ⚡ Axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Token interceptor (Admin login mate)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// ❌ Global error handler (optional but useful)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired / invalid
      localStorage.removeItem("adminToken");
      window.location.hash = "#/login";
    }
    return Promise.reject(error);
  }
);

export default api;