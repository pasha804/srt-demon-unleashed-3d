/**
 * vite.spa.config.ts
 *
 * Static SPA build config for Netlify drag-drop deployment.
 * Bypasses TanStack Start / Nitro / SSR entirely.
 * Produces a standard dist/ with index.html + hashed assets.
 *
 * Usage:
 *   npm run build:spa        → builds to dist-spa/
 *   Then drag dist-spa/ to netlify.com/drop
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    // Generate routeTree.gen.ts from the routes/ folder
    TanStackRouterVite({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist-spa",
    emptyOutDir: true,
  },
});
