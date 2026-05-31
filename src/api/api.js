import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";

// Always same-origin /api (Vite proxy in dev, Express proxy on Render) — avoids CORS issues.
export const API_BASE = "";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
