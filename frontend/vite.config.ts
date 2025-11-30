import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Используем новый JSX runtime для React 19
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Поддержка путей для planner модулей
      "@planner": path.resolve(__dirname, "./src/features/planner"),
      // Гарантируем использование одной версии React
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    // Предотвращаем дублирование React
    dedupe: ['react', 'react-dom'],
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
        manualChunks(id) {
          // Keep all React-related packages together to avoid initialization issues
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform')
          ) {
            return 'react-vendor';
          }
          // Separate three.js into its own chunk
          if (id.includes('node_modules/three')) {
            return 'three';
          }
        },
      },
      // Предотвращаем разделение blueprint модулей на разные чанки
      // чтобы избежать проблем с порядком инициализации
      preserveEntrySignatures: 'strict',
    },
    // Увеличиваем лимит для лучшей стабильности
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // Оптимизация для React
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@calvinscofield/three-objloader'],
  },
});

