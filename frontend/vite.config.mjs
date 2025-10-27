import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",
    port: 5173,
    open: true,
    middleware: [
      history({
        disableDotRule: true,
        verbose: true,
      }),
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
