export const FRONTEND_URL = (
  import.meta.env.VITE_FRONTEND_URL || "https://portfolio-frontend-blu4.onrender.com"
).replace(/\/$/, "");

/** Open live portfolio with cache-bust + section hash. */
export function viewSiteLink(sectionId = "") {
  const hash = sectionId
    ? sectionId.startsWith("#")
      ? sectionId
      : `#${sectionId}`
    : "";
  return `${FRONTEND_URL}/?v=${Date.now()}${hash}`;
}
