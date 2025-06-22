// @ts-check
import withNuxt from "@nuxt/eslint-config";

export default withNuxt(
  // 基本設定を最初に
  {},
  // 無視するファイル/ディレクトリを指定
  {
    ignores: [
      // 依存関係
      "node_modules/**",
      "pnpm-lock.yaml",
      // ビルド出力
      "dist/**",
      ".output/**",
      ".nuxt/**",
      // 設定ファイル
      "nuxt.config.ts",
      "vitest.config.ts",
      "vitest.browser.config.ts",
      // その他
      ".env",
      ".env.*",
      "coverage/**",
      "*.log",
      // IDEファイル
      ".vscode/**",
      ".idea/**",
    ],
  },
  // カスタムルールを追加
  {
    rules: {
      // Nuxt 3とVue 3のベストプラクティス
      "vue/multi-word-component-names": "off", // Nuxt 3では必須ではない
      "vue/require-default-prop": "off", // Composition APIでは必要ない場合が多い

      // TypeScript関連
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // コード品質
      "no-console": "warn", // 本番環境では警告
      "no-debugger": "error", // debugger文は禁止
    },
  },
  // テストファイル用の設定
  {
    files: ["tests/**/*.{js,ts,vue}", "**/*.test.{js,ts}", "**/*.spec.{js,ts}"],
    rules: {
      // テストファイルでは console.log を許可
      "no-console": "off",
      // テストファイルでは未使用の変数を緩く
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
