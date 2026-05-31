import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const BACKEND =
  process.env.BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";
const distDir = path.join(__dirname, "dist");

const proxyOptions = {
  target: BACKEND,
  changeOrigin: true,
  on: {
    error(err, req, res) {
      console.error("Proxy error:", err.message);
      if (!res.headersSent) {
        res.status(502).json({
          message: "Backend unavailable. Wait 30 seconds and try again.",
        });
      }
    },
  },
};

// /api/auth/* → backend /api/auth/*
app.use(
  "/api",
  createProxyMiddleware({
    ...proxyOptions,
    pathRewrite: (p) => (p.startsWith("/api") ? p : `/api${p}`),
  })
);

// Profile / project images stored on backend disk
app.use("/uploads", createProxyMiddleware(proxyOptions));

app.use(express.static(distDir, { index: "index.html" }));

// SPA: /login, /register, /dashboard — must return index.html (fixes Render 404 on refresh)
app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Admin panel on port ${PORT} → ${BACKEND}`);
});
