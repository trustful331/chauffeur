import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Proxies /api/* → https://chaufeer.vercel.app/api/* (matches src/config/env.tsx)
    proxy: {
      "/api": {
        target: "https://chaufeer.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
