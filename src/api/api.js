import axios from "axios";
import { getApiBase, getBackendUrl } from "../utils/getApiBase.js";

export const BACKEND_URL = getBackendUrl();
export const API_BASE = import.meta.env.DEV ? "" : BACKEND_URL;

const apiBase = getApiBase();

const api = axios.create({
  baseURL: apiBase,
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (
    config.data &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData)
  ) {
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
  (response) => {
    const data = response.data;
    if (typeof data === "string" && /not found|<!doctype html>/i.test(data)) {
      return Promise.reject(
        Object.assign(new Error("API returned invalid response"), { response })
      );
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      if (!window.location.hash.includes("/login")) {
        window.location.replace("/#/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
