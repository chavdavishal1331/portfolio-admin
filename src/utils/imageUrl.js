import { BACKEND_URL } from "../api/api";

export function getImageUrl(path) {
  if (!path) return "";

  const base = BACKEND_URL;

  if (path.startsWith("http")) {
    if (/localhost|127\.0\.0\.1/.test(path)) {
      const uploadsPath = path.match(/\/uploads\/[^?#]+/)?.[0];
      if (uploadsPath) return `${base}${uploadsPath}`;
    }
    return path;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
