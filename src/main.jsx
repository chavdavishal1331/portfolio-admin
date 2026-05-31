import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { initApiBase } from "./utils/getApiBase.js";
import "./styles/admin.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function renderApp() {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </HashRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

root.render(
  <div className="admin-root admin-loading" style={{ minHeight: "100vh" }}>
    <div className="admin-spinner" />
    <p style={{ marginTop: "1rem", textAlign: "center", opacity: 0.8 }}>
      Connecting to server…
    </p>
  </div>
);

initApiBase()
  .then(renderApp)
  .catch(() => {
    renderApp();
  });
