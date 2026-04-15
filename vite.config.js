import { defineConfig } from "vite";

// Proxy frontend API calls to backend during development
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
