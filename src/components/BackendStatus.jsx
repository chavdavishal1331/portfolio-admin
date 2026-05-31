import { useCallback, useEffect, useState } from "react";
import { getApiBase, getBackendUrl, initApiBase } from "../utils/getApiBase.js";
import { checkBackendHealth } from "../utils/checkHealth.js";

const WAKE_RETRIES = 5;
const WAKE_DELAY_MS = 15000;

function BackendStatus() {
  const [status, setStatus] = useState("checking");
  const [version, setVersion] = useState("");
  const [apiBase, setApiBase] = useState("");

  const checkHealth = useCallback(async () => {
    setStatus("checking");
    await initApiBase();
    const base = getApiBase();
    setApiBase(base);

    for (let attempt = 0; attempt < WAKE_RETRIES; attempt += 1) {
      try {
        const data = await checkBackendHealth();
        setStatus("ok");
        setVersion(data.version || "");
        return;
      } catch {
        /* Render cold start or CORS — retry */
      }
      if (attempt < WAKE_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, WAKE_DELAY_MS));
      }
    }
    setStatus("error");
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const frontendUrl =
    import.meta.env.VITE_FRONTEND_URL ||
    "https://portfolio-frontend-blu4.onrender.com";

  return (
    <div className="admin-panel admin-status-panel">
      <p>
        <strong>API:</strong>{" "}
        {status === "checking" && "Waking up server (may take 30–60s)…"}
        {status === "ok" && (
          <span className="admin-status-ok">
            Connected to {apiBase || getApiBase()}
            {version ? ` · ${version}` : ""}
          </span>
        )}
        {status === "error" && (
          <span className="admin-status-error">
            Cannot reach backend at {getBackendUrl()}.{" "}
            <button
              type="button"
              className="admin-status-retry"
              onClick={checkHealth}
            >
              Retry
            </button>
          </span>
        )}
      </p>
      <p>
        <strong>Portfolio site:</strong>{" "}
        <a href={frontendUrl} target="_blank" rel="noopener noreferrer">
          {frontendUrl}
        </a>
      </p>
      <p className="admin-status-hint">
        Admin saves to <strong>{getBackendUrl()}</strong>. After saving, refresh
        the portfolio site or click “View on portfolio”.
      </p>
    </div>
  );
}

export default BackendStatus;
