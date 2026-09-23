import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/Smart-Card/",

  server: {
    port: 5173,
  },
});