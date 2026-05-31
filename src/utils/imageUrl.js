import { BACKEND_URL } from "../api/api";

/** Image/PDF URLs for admin previews (uploads proxied on admin server, Cloudinary as full URL). */
export function getImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (/localhost|127\.0\.0\.1/.test(path)) {
      const uploadsPath = path.match(/\/uploads\/[^?#]+/)?.[0];
      if (uploadsPath) return uploadsPath;
    }
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized.startsWith("/uploads/")) {
    return normalized;
  }

  return `${BACKEND_URL}${normalized}`;
}
