/**
 * API base URL for axios.
 * - Dev: Vite proxy at /api
 * - Embedded on backend (/admin): same origin /api
 * - Standalone admin on Render: direct backend URL
 */
export function getBackendUrl() {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
  }
  if (import.meta.env.VITE_SAME_ORIGIN === "true" && typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://portfolio-backend-ro4m.onrender.com";
}

export function getApiBase() {
  if (import.meta.env.DEV) return "/api";
  if (import.meta.env.VITE_SAME_ORIGIN === "true" && typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }
  return `${getBackendUrl()}/api`;
}
