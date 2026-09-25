import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),

    {
      name: "github-pages-spa-fallback",

      closeBundle() {
        if (command !== "build") return;

        const indexPath = "dist/index.html";
        const fallbackPath = "dist/404.html";

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath);
          console.log("✓ GitHub Pages SPA fallback created: dist/404.html");
        }
      },
    },
  ],

  base: command === "build" ? "/Smart-Card/" : "/",

  server: {
    port: 5173,
  },
}));