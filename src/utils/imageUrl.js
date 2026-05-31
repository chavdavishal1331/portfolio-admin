import { API_BASE } from "../api/api";

export function getImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http")) {
    if (/localhost|127\.0\.0\.1/.test(path)) {
      const uploadsPath = path.match(/\/uploads\/[^?#]+/)?.[0];
      if (uploadsPath) return `${API_BASE}${uploadsPath}`;
    }
    return path;
  }

  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
