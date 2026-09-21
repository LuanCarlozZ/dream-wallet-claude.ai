import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      injectRegister: null,
      filename: "sw.js",
      manifest: false,
      devOptions: { enabled: false },
      workbox: {
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/\~oauth/],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: { cacheName: "fincontrol-pages", networkTimeoutSeconds: 3 },
          },
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && /\.[a-f0-9]{8,}\.(js|css)$/.test(url.pathname),
            handler: "CacheFirst",
            options: { cacheName: "fincontrol-assets" },
          },
        ],
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
