import { useEffect, useState } from "react";
import { BACKEND_URL } from "../api/api";
import api from "../api/api";

function BackendStatus() {
  const [status, setStatus] = useState("checking");
  const [version, setVersion] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/health")
      .then(({ data }) => {
        if (cancelled) return;
        setStatus(data?.ok ? "ok" : "error");
        setVersion(data?.version || "");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const frontendUrl =
    import.meta.env.VITE_FRONTEND_URL ||
    "https://portfolio-frontend-blu4.onrender.com";

  return (
    <div className="admin-panel admin-status-panel">
      <p>
        <strong>API:</strong>{" "}
        {status === "checking" && "Connecting…"}
        {status === "ok" && (
          <span className="admin-status-ok">
            Connected to {BACKEND_URL}
            {version ? ` (${version})` : ""}
          </span>
        )}
        {status === "error" && (
          <span className="admin-status-error">
            Cannot reach backend. Wait 30s (Render cold start) and refresh.
          </span>
        )}
      </p>
      <p>
        <strong>Portfolio site:</strong>{" "}
        <a href={frontendUrl} target="_blank" rel="noopener noreferrer">
          {frontendUrl}
        </a>
        {" "}
        — content you save here appears there after deploy.
      </p>
      <p className="admin-status-hint">
        Images on Render need Cloudinary env vars on the backend, or uploads may
        disappear after a restart.
      </p>
    </div>
  );
}

export default BackendStatus;
