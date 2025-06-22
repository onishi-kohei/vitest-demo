import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        ".nuxt/",
        "coverage/",
        "**/*.test.{js,ts}",
        "**/*.config.{js,ts}",
        "tests/setup.ts",
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    // ブラウザモードの設定
    browser: {
      enabled: false, // デフォルトではブラウザモードを無効化
      name: "chromium",
      provider: "playwright",
      headless: true,
      // ビューポート設定
      viewport: {
        width: 1280,
        height: 720,
      },
    },
    // テストファイルの分類
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    exclude: [
      "node_modules/",
      "dist/",
      ".nuxt/",
      "tests/**/*.browser.{test,spec}.{js,ts}", // ブラウザテストは別コマンドで実行
    ],
    // テストタイムアウト設定
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "~": resolve(__dirname, "."),
    },
  },
});
