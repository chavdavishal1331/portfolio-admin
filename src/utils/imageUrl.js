import { BACKEND_URL } from "../api/api";

/**
 * Full URL for images/PDFs in admin previews.
 * Uploads live on the backend — always use BACKEND_URL (admin /uploads proxy is not reliable on Render).
 */
export function getImageUrl(path) {
  if (!path) return "";

  const base = BACKEND_URL.replace(/\/$/, "");

  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (/localhost|127\.0\.0\.1/.test(path)) {
      const uploadsPath = path.match(/\/uploads\/[^?#]+/)?.[0];
      if (uploadsPath) return `${base}${uploadsPath}`;
    }
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
