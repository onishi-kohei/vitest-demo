import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    // ブラウザモードの設定
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
      // ビューポート設定
      viewport: {
        width: 1280,
        height: 720,
      },
    },
    // ブラウザテストファイルのみを対象
    include: ["tests/browser/**/*.{test,spec}.{js,ts}"],
    // テストタイムアウト設定（ブラウザテストは時間がかかる）
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "~": resolve(__dirname, "."),
    },
  },
});
