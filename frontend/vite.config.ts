// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { loadEnv } from 'vite';

export default defineConfig(({ mode }: { mode: string }) => {
  // load env for current mode
  const env = loadEnv(mode, process.cwd(), '');
  const rawApi = env.VITE_APP_API_URL || '';
  const proxyTarget = env.VITE_APP_PROXY_TARGET || (rawApi ? rawApi.replace(/\/?api\/?$/i, '') : undefined) || 'http://localhost:3001';

  return {
  plugins: [react()],
  build: {
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    server: {
      port: Number(env.PORT || 3000),
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
