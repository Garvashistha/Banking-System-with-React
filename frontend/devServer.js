import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import history from "connect-history-api-fallback";
import path from "path";

const root = process.cwd();

const start = async () => {
  const vite = await createServer({
    root,
    plugins: [react()],
    server: { port: 5173 },
    resolve: {
      alias: {
        "@": path.resolve(root, "src"),
      },
    },
  });

  vite.middlewares.use(history());

  await vite.listen();
  console.log("✅ Dev server running on http://localhost:5173");
};

start();
