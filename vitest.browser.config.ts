import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "~": resolve(__dirname, "."),
    },
  },
  test: {
    name: "browser",
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.browser.ts"],
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [
        {
          browser: "chromium",
          headless: true,
          viewport: {
            width: 1280,
            height: 720,
          },
        },
      ],
    },
    include: ["tests/browser/**/*.{test,spec}.{js,ts}"],
    exclude: ["node_modules/", "dist/", ".nuxt/"],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
