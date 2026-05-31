import axios from "axios";
import { getApiBase, getBackendUrl, initApiBase } from "../utils/getApiBase.js";

/** Resolved at request time so same-origin proxy URL is correct on Render. */
export function getBackendUrlForAssets() {
  return getBackendUrl();
}

const api = axios.create({
  timeout: 120000,
});

api.interceptors.request.use(async (config) => {
  config.baseURL = await initApiBase();

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
        const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
        window.location.replace(`${base}#/login`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
