import { getApiBase } from "./getApiBase.js";

/** Lightweight health check (no extra headers → no CORS preflight issues). */
export async function checkBackendHealth() {
  const base = getApiBase();
  const res = await fetch(`${base}/health?_t=${Date.now()}`, {
    method: "GET",
    cache: "no-store",
    mode: "cors",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.ok) throw new Error("Backend not ready");
  return data;
}
