import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    // Yahan .ts ko .js mein badal diya hai
    setupFiles: ["./src/test/setup.js"],
    // Yahan test files ko .js aur .jsx mein dhoondhne ke liye update kiya hai
    include: ["src/**/*.{test,spec}.{js,jsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});