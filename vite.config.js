import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],

  // Local development:
  // http://localhost:5173/

  // Production / GitHub Pages:
  // https://mohamedsayed98299-cmd.github.io/Smart-Card/
  base: command === "build" ? "/Smart-Card/" : "/",

  server: {
    port: 5173,
  },
}));