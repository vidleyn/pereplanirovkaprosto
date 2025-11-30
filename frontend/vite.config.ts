import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Поддержка путей для planner модулей
      "@planner": path.resolve(__dirname, "./src/features/planner"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/dashboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  // Поддержка больших файлов для моделей
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'blueprint': ['./src/features/planner/src/scripts/blueprint.js'],
        },
      },
      onwarn(warning, warn) {
        // Игнорировать некоторые предупреждения, чтобы не блокировать сборку
        if (warning.code === 'UNRESOLVED_IMPORT' || 
            warning.code === 'CIRCULAR_DEPENDENCY' ||
            warning.message?.includes('is imported')) {
          return;
        }
        warn(warning);
      },
    },
  },
  // Отключить проверку типов TypeScript во время сборки
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
});
