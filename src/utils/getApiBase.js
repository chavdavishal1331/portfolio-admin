const DEFAULT_BACKEND = "https://portfolio-backend-ro4m.onrender.com";

let cachedApiBase = null;
let cachedBackendUrl = null;
let initPromise = null;

function useSameOriginApi() {
  return (
    import.meta.env.VITE_SAME_ORIGIN === "true" ||
    import.meta.env.VITE_SAME_ORIGIN === true
  );
}

function directBackendUrl() {
  return (import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND).replace(/\/$/, "");
}

function directApiBase() {
  return `${directBackendUrl()}/api`;
}

function sameOriginApiBase() {
  return `${window.location.origin}/api`;
}

async function probeHealth(apiBase) {
  try {
    const res = await fetch(`${apiBase}/health?_t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}

/**
 * Pick a working API base (static admin has no /api proxy — use direct backend).
 */
export async function initApiBase() {
  if (cachedApiBase) return cachedApiBase;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (import.meta.env.VITE_BACKEND_URL) {
      cachedApiBase = directApiBase();
      cachedBackendUrl = directBackendUrl();
      return cachedApiBase;
    }

    if (import.meta.env.DEV) {
      cachedApiBase = "/api";
      cachedBackendUrl =
        import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") ||
        (typeof window !== "undefined" ? window.location.origin : DEFAULT_BACKEND);
      return cachedApiBase;
    }

    if (useSameOriginApi() && typeof window !== "undefined") {
      const local = sameOriginApiBase();
      if (await probeHealth(local)) {
        cachedApiBase = local;
        cachedBackendUrl = window.location.origin;
        return cachedApiBase;
      }
    }

    cachedApiBase = directApiBase();
    cachedBackendUrl = directBackendUrl();
    return cachedApiBase;
  })();

  return initPromise;
}

export function getApiBase() {
  if (cachedApiBase) return cachedApiBase;
  if (import.meta.env.VITE_BACKEND_URL) return directApiBase();
  if (import.meta.env.DEV) return "/api";
  if (useSameOriginApi() && typeof window !== "undefined") {
    return sameOriginApiBase();
  }
  return directApiBase();
}

export function getBackendUrl() {
  if (cachedBackendUrl) return cachedBackendUrl;
  if (import.meta.env.VITE_BACKEND_URL) return directBackendUrl();
  if (import.meta.env.DEV && typeof window !== "undefined") {
    return import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || window.location.origin;
  }
  if (useSameOriginApi() && typeof window !== "undefined") {
    return window.location.origin;
  }
  return directBackendUrl();
}
