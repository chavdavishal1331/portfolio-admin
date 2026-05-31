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
const indexHtml = path.join(distDir, "index.html");

const uploadsProxy = createProxyMiddleware({
  target: BACKEND,
  changeOrigin: true,
});

const apiProxy = createProxyMiddleware({
  target: BACKEND,
  changeOrigin: true,
  pathRewrite: (p) => (p.startsWith("/api") ? p : `/api${p}`),
});

app.use((req, res, next) => {
  if (req.url.startsWith("/api")) return apiProxy(req, res, next);
  if (req.url.startsWith("/uploads")) return uploadsProxy(req, res, next);
  next();
});

app.use(
  express.static(distDir, {
    index: false,
    fallthrough: true,
  })
);

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).send("Method not allowed");
  }
  res.sendFile(indexHtml, (err) => {
    if (err) next(err);
  });
});

app.listen(PORT, () => {
  console.log(`Admin panel on port ${PORT} → ${BACKEND}`);
});
