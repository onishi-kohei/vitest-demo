# Vitest Browser Mode Demo

Nuxt 3 + Vitest ブラウザモードを使用したリグレッションテスト環境のデモプロジェクト

## 🎯 プロジェクト概要

このプロジェクトは、Vitest のブラウザモードを活用したモダンなテスト環境を構築し、リグレッションテストを効率的に実行できる環境を提供します。

### 主な特徴

- **Nuxt 3** - モダンな Vue.js フレームワーク
- **Vitest Browser Mode** - Playwright 統合によるブラウザベーステスト
- **TypeScript** - 型安全性とより良い開発体験
- **Multiple Test Strategies** - ユニット、インテグレーション、ブラウザテストの包括的テスト戦略

## 🚀 クイックスタート

### 前提条件

- Node.js 18.x 以上
- pnpm (推奨) または npm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd vitest-demo

# 依存関係をインストール
pnpm install

# Playwrightブラウザをインストール
pnpm exec playwright install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動
pnpm dev
```

## 🧪 テスト戦略

### テストの種類

1. **ユニットテスト** (`tests/unit/`)

   - Vue Test Utils + Vitest
   - コンポーネントの個別機能テスト
   - 高速実行、モック使用

2. **インテグレーションテスト** (`tests/integration/`)

   - @nuxt/test-utils + Vitest
   - コンポーネント間の連携テスト
   - ページレベルの統合テスト

3. **ブラウザテスト** (`tests/browser/`)
   - Vitest Browser Mode + Playwright
   - 実ブラウザでの E2E テスト
   - ユーザーインタラクションテスト

### テストコマンド

```bash
# すべてのテストを実行
pnpm test:all

# ユニットテストのみ
pnpm test:unit

# インテグレーションテストのみ
pnpm test:integration

# ブラウザテストのみ
pnpm test:browser

# テストUI（開発時）
pnpm test:ui

# カバレッジ付きテスト
pnpm test:coverage

# ウォッチモード
pnpm test:watch
```

## 📁 プロジェクト構造

```
├── components/          # Vueコンポーネント
│   ├── Counter.vue      # カウンターコンポーネント
│   ├── UserForm.vue     # ユーザーフォームコンポーネント
│   └── TaskList.vue     # タスクリストコンポーネント
├── pages/               # Nuxtページ
│   └── index.vue        # メインページ
├── tests/               # テストファイル
│   ├── unit/            # ユニットテスト
│   ├── integration/     # インテグレーションテスト
│   ├── browser/         # ブラウザテスト
│   └── setup.ts         # テストセットアップ
├── .github/             # GitHub Actions設定
└── vitest.config.ts     # Vitest設定
```

## 🔧 設定ファイル

### Vitest 設定 (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
      screenshot: {
        mode: "on",
        directory: "./tests/screenshots",
      },
    },
  },
});
```

### Nuxt 設定 (`nuxt.config.ts`)

Vitest ブラウザモードに最適化された設定で、SSR と TypeScript の厳密な型チェックを有効化。

## 📊 テストカバレッジ

プロジェクトは以下のカバレッジ目標を設定しています：

- **Lines**: 80%以上
- **Functions**: 80%以上
- **Branches**: 80%以上
- **Statements**: 80%以上

カバレッジレポートは `coverage/` ディレクトリに生成されます。

## 🎨 デモコンポーネント

### 1. Counter コンポーネント

- インクリメント/デクリメント機能
- リセット機能
- リアクティブな状態管理

### 2. UserForm コンポーネント

- フォームバリデーション
- リアルタイムエラー表示
- 非同期送信処理

### 3. TaskList コンポーネント

- タスクの追加/削除
- 完了状態の切り替え
- フィルタリング機能
- 一括操作

## 🚢 CI/CD

GitHub Actions を使用した自動テスト実行：

- **プルリクエスト時**: 全テストスイート実行
- **プッシュ時**: カバレッジレポート生成
- **ビジュアルリグレッション**: スクリーンショット比較
- **パフォーマンステスト**: バンドルサイズ監視

## 🛠️ 開発ガイドライン

### テストファイルの命名規則

- ユニットテスト: `*.test.ts`
- インテグレーションテスト: `*.integration.test.ts`
- ブラウザテスト: `*.browser.test.ts`

### コンポーネント設計原則

1. **テスト可能性**: `data-testid` 属性の使用
2. **アクセシビリティ**: 適切な ARIA 属性とラベル
3. **型安全性**: TypeScript の活用
4. **リアクティビティ**: Vue 3 Composition API の使用

## 📚 参考資料

- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/)
- [Playwright](https://playwright.dev/)

## 🤝 コントリビューション

1. フォークしてクローン
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. テストを追加/更新
4. コミット (`git commit -m 'Add amazing feature'`)
5. プッシュ (`git push origin feature/amazing-feature`)
6. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。
