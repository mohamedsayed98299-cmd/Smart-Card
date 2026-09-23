import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),

    {
      name: "github-pages-spa-fallback",

      closeBundle() {
        const distPath = path.resolve("dist");
        const indexPath = path.join(distPath, "index.html");
        const fallbackPath = path.join(distPath, "404.html");

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath);
          console.log("✓ Created dist/404.html for GitHub Pages SPA routing");
        }
      },
    },
  ],

  base: "/Smart-Card/",

  server: {
    port: 5173,
  },
});