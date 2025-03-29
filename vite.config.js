import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Adjusting environment variables for Shopify App URL
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

// Determine host for HMR
const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;
let hmrConfig;

if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

// Vite configuration
export default defineConfig({
  server: {
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // Allow serving files from these directories
      allow: ["app", "node_modules"],
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"], // Ignore files that start with a dot
    }),
    tsconfigPaths(), // Resolve TypeScript paths
  ],
  build: {
    assetsInlineLimit: 0, // Disable asset inlining
    rollupOptions: {
      // Externalize Node.js built-ins to avoid issues in the browser
      external: [
        "node:crypto",
        "node:stream",
        "node:assert",
        "node:buffer",
        "node:zlib",
      ],
    },
  },
});
