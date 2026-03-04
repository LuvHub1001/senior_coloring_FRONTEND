import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@routers": path.resolve(__dirname, "src/routers"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@images": path.resolve(__dirname, "src/assets/images"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@apis": path.resolve(__dirname, "src/apis"),
      "@type": path.resolve(__dirname, "src/types"),
      "@hoc": path.resolve(__dirname, "src/hoc"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@css": path.resolve(__dirname, "src/css"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
});
