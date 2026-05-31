import express from "express";
import http from "http";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const BACKEND = new URL(
  process.env.BACKEND_URL || "https://portfolio-backend-ro4m.onrender.com"
);
const distDir = path.join(__dirname, "dist");
const indexHtml = path.join(distDir, "index.html");
const client = BACKEND.protocol === "https:" ? https : http;

/** Stream request/response — works for JSON and multipart file uploads. */
function proxyToBackend(req, res) {
  const options = {
    protocol: BACKEND.protocol,
    hostname: BACKEND.hostname,
    port: BACKEND.port || (BACKEND.protocol === "https:" ? 443 : 80),
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: BACKEND.host,
    },
  };

  const proxyReq = client.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    Object.entries(proxyRes.headers).forEach(([key, value]) => {
      if (value !== undefined && key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    if (!res.headersSent) {
      res.status(502).json({
        message: "Backend unavailable. Wait 30 seconds and try again.",
      });
    }
  });

  req.pipe(proxyReq);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, proxy: true, backend: BACKEND.origin });
});

app.use((req, res, next) => {
  if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
    return proxyToBackend(req, res);
  }
  next();
});

app.use(express.static(distDir, { index: false, fallthrough: true }));

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).send("Method not allowed");
  }
  res.sendFile(indexHtml, (err) => {
    if (err) next(err);
  });
});

app.listen(PORT, () => {
  console.log(`Admin panel on port ${PORT} → ${BACKEND.origin}`);
});
