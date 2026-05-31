const STORAGE_KEY = "portfolio-content-updated";

/** Tell open portfolio tabs to refetch (admin save → live site). */
export function notifyPortfolioUpdate() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* private browsing */
  }
  window.dispatchEvent(new CustomEvent("portfolio-content-updated"));
}
