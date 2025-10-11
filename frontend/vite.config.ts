// src/vite.config.ts (patch)
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
-   port: 8080,
+   port: 5173,
  },
  ...
}));
