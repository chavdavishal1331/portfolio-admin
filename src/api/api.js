import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";

// Empty VITE_API_BASE = use same-origin /api proxy (Web Service on Render)
const useProxy = import.meta.env.VITE_API_BASE === "";

export const API_BASE = useProxy ? "" : import.meta.env.VITE_API_BASE || BACKEND_URL;

const api = axios.create({
  baseURL: useProxy ? "/api" : `${API_BASE}/api`,
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