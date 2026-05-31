import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standalone Render deploy: "/". Backend embed at /admin: "/admin/"
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 3001,
    strictPort: false,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
