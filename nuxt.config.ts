// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: false, // 開発時のパフォーマンス向上のため無効化
  },

  // CSS設定
  css: [],

  // テスト環境のためのSSR設定
  ssr: true,

  // Vitestブラウザモードテスト用の設定
  nitro: {
    experimental: {
      wasm: true,
    },
  },

  // 実験的機能
  experimental: {
    // payloadExtraction: false
  },

  // モジュール（将来的にテスト関連モジュールを追加）
  modules: ["@nuxt/eslint"],
});
