import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";

// Same-origin /api — admin server proxies to backend (JSON + file uploads)
export const API_BASE = "";

const api = axios.create({
  baseURL: "/api",
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  if ((config.method || "get").toLowerCase() === "get") {
    config.headers["Cache-Control"] = "no-cache";
    config.headers.Pragma = "no-cache";
    config.params = { ...config.params, _t: Date.now() };
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
