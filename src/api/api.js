import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";

// Dev: Vite proxy. Prod: direct backend (CORS) so admin works even without Node proxy.
export const API_BASE = import.meta.env.DEV ? "" : BACKEND_URL;

const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : `${BACKEND_URL}/api`,
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
      window.location.hash = "#/login";
    }
    return Promise.reject(error);
  }
);

export default api;
