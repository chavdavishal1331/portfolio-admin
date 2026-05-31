import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const BACKEND = process.env.BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";

app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND,
    changeOrigin: true,
    pathRewrite: (path) => (path.startsWith("/api") ? path : `/api${path}`),
  })
);

const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
// Older builds used base "/admin/" — keep assets reachable at /admin/assets/*
app.use("/admin", express.static(distDir));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
