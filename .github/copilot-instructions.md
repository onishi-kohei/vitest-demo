````instructions
# GitHub Copilot カスタム命令

## プロジェクト概要

このリポジトリは、Vitest のブラウザモードを試すための Nuxt プロジェクトです。リグレッションテストの環境を整備し、ブラウザベースのテストを効率的に実行できる環境を構築します。

## 開発方針

### テスト戦略

- Vitest のブラウザモードを活用した E2E テストの実装
- コンポーネントテストとインテグレーションテストの充実
- リグレッションテストの自動化
- テストカバレッジの向上

### 技術スタック

- **フレームワーク**: Nuxt 3
- **テストフレームワーク**: Vitest (ブラウザモード)
- **ブラウザテスト**: Playwright/Puppeteer
- **UI コンポーネント**: Vue 3 Composition API

### コーディング規約

- TypeScript を優先して使用
- Vue 3 の Composition API を使用
- テストファーストな開発アプローチ
- ESLint + Prettier によるコード品質管理

### 品質保証方針

#### ESLint による静的解析
- **事前チェック**: 新規開発時は必ず `pnpm lint` でコード品質をチェック
- **自動修正**: `pnpm lint:fix` で修正可能な問題は自動修正を優先
- **警告ゼロ**: `pnpm lint:check` で警告数0を維持することを必須とする
- **型安全性**: TypeScript の厳格な型チェックを活用し、`any` 型の使用を避ける
- **Vue ベストプラクティス**: Vue 3 公式スタイルガイドに準拠した属性順序とコンポーネント設計

#### テスト駆動開発（TDD）
- **テストファースト**: 新機能開発前にテストケースを先に作成
- **3層テスト戦略**:
  - ユニットテスト（単体機能の検証）
  - インテグレーションテスト（コンポーネント間連携の検証）
  - ブラウザテスト（E2E での実際のユーザー操作検証）
- **カバレッジ目標**: テストカバレッジ80%以上を維持
- **リグレッション防止**: 既存機能の動作保証のための継続的テスト実行

#### 開発フロー
1. **設計フェーズ**: 要件定義とテストケース設計
2. **テスト作成**: 期待する動作のテストコードを先に実装
3. **実装フェーズ**: テストが通るように機能を実装
4. **品質チェック**: ESLint + テスト実行で品質確認
5. **リファクタリング**: コード品質向上とパフォーマンス最適化

#### 品質ゲート
- **コミット前**: `pnpm format:lint && pnpm test:run` の実行を必須
- **PR レビュー**: ESLint エラー0、テスト成功率100%を確認
- **継続的品質監視**: CI/CD パイプラインでの自動品質チェック

## Copilot への指示

### テスト関連のコード生成時

- Vitest のブラウザモード設定を考慮したテストコードを生成
- `@vitest/ui` を活用したテスト実行環境の提案
- ブラウザ環境での DOM 操作テストを含める
- リグレッションテスト用のスナップショットテストを提案
- **品質保証**: テストファーストアプローチでテストコードを先に生成
- **型安全性**: VueWrapper型などの適切な型定義を使用

### ESLint・品質管理関連のコード生成時

- **Vue 公式準拠**: Vue 3 公式スタイルガイドに従った属性順序とコンポーネング設計
- **TypeScript厳格性**: `any` 型の使用を避け、具体的な型定義を提案
- **自動修正優先**: ESLint で自動修正可能なコードパターンを提案
- **警告ゼロ目標**: lint:check で警告が出ないコード品質を維持
- **開発効率**: format:lint コマンドで一括修正可能な形式でコード生成

### Nuxt 関連のコード生成時

- Nuxt 3 の最新機能とベストプラクティスに従う
- `composables/`, `components/`, `pages/` ディレクトリ構造を遵守
- サーバーサイドレンダリング（SSR）を考慮した実装
- Nuxt の auto-import を活用したコード生成

### ファイル構成の提案時

```
├── components/          # Vue コンポーネント
├── composables/         # Composition API ユーティリティ
├── pages/              # ページコンポーネント
├── tests/              # テストファイル
│   ├── unit/           # ユニットテスト
│   ├── integration/    # インテグレーションテスト
│   └── browser/        # ブラウザテスト
├── vitest.config.ts    # Vitest設定
└── nuxt.config.ts      # Nuxt設定
```

### 優先的に提案すべき項目

1. テスト可能性を考慮したコンポーネント設計
2. ブラウザモードでのテスト実行最適化
3. CI/CD パイプラインでのテスト自動化
4. リグレッションテストのためのビジュアルテスト環境
5. テストデータの管理とモック化

### 避けるべき提案

- 複雑すぎるテスト設定
- ブラウザモードに対応しないテスト手法
- Nuxt 3 の機能と競合する実装
- 保守性を損なう過度な抽象化

## 実装ガイドライン

### 新規開発時の品質保証手順

#### 1. 開発開始前
- **要件整理**: 機能要件とテスト要件を明確化
- **設計検討**: コンポーネント設計とテスト戦略の策定
- **ESLint確認**: `pnpm lint:check` で現在のコードベースが警告0であることを確認

#### 2. テスト駆動開発サイクル
```bash
# 1. テストファイル作成（先にテストを書く）
# 2. テスト実行（最初は失敗することを確認）
pnpm test:run
# 3. 最小限の実装でテストを通す
# 4. ESLintチェック
pnpm lint:check
# 5. リファクタリング
# 6. 再度テスト実行で動作確認
pnpm test:run
```

#### 3. コミット前チェック
```bash
# 必須実行コマンド
pnpm format:lint    # コード整形 + ESLint修正
pnpm test:run       # 全テスト実行
pnpm lint:check     # 警告0確認
```

### テストファイルの命名規則

- ユニットテスト: `*.test.ts`
- インテグレーションテスト: `*.integration.test.ts`
- ブラウザテスト: `*.browser.test.ts`

### コンポーネントテストの基本構造

```typescript
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Component from "@/components/Component.vue";

describe("Component", () => {
  it("renders correctly", () => {
    const wrapper = mount(Component);
    expect(wrapper.text()).toContain("expected text");
  });
});
```

### ブラウザテストの基本構造

```typescript
import { test, expect } from "vitest";
import { page } from "@vitest/browser/context";

test("browser interaction", async () => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Welcome");
});
```
````
