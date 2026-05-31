import { getBackendUrlForAssets } from "../api/api";

function appendCacheBust(url, cacheKey) {
  if (!cacheKey) return url;
  const v = encodeURIComponent(String(cacheKey));
  return `${url}${url.includes("?") ? "&" : "?"}v=${v}`;
}

/**
 * Full URL for images/PDFs. Pass updatedAt (or any version) to avoid stale browser cache.
 */
export function getImageUrl(path, cacheKey) {
  if (!path) return "";

  const base = getBackendUrlForAssets().replace(/\/$/, "");

  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (/localhost|127\.0\.0\.1/.test(path)) {
      const uploadsPath = path.match(/\/uploads\/[^?#]+/)?.[0];
      if (uploadsPath) return appendCacheBust(`${base}${uploadsPath}`, cacheKey);
    }
    return appendCacheBust(path, cacheKey);
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return appendCacheBust(`${base}${normalized}`, cacheKey);
}
