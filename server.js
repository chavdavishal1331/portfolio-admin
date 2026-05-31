import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const BACKEND =
  process.env.BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com";

// Proxy /api/* → backend /api/* (same path on target — see http-proxy-middleware docs)
app.use(
  "/api",
  createProxyMiddleware({
    target: `${BACKEND}/api`,
    changeOrigin: true,
  })
);

const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
app.use("/admin", express.static(distDir));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
