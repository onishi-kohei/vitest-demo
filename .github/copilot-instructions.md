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
- **MCP サーバー**: Model Context Protocol による AI アシスタント統合

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

### MCP (Model Context Protocol) 統合開発

このプロジェクトは、AI アシスタント（GitHub Copilot、Cursor、Claude等）との連携を最適化するため、MCPサーバーを統合しています。

#### MCP を活用した開発フロー

1. **プロジェクト理解の促進**
   - 「プロジェクトの構造を教えて」→ `get-project-structure` ツール活用
   - 「テスト設定を確認して」→ `get-test-info` ツール活用
   - 「Nuxt設定を取得して」→ `get-nuxt-config` ツール活用

2. **テスト駆動開発の支援**
   - 「新しいコンポーネントのテストファイルを生成して」→ `generate-test-file` ツール活用
   - 「ユニットテストを実行して」→ `run-tests` ツール活用
   - 「品質チェックを実行して」→ `run-quality-check` ツール活用

3. **コード品質の向上**
   - 「ESLintエラーを修正して」→ `run-quality-check` で自動修正
   - 「コンポーネント一覧を確認して」→ `list-nuxt-components` ツール活用
   - 「自動インポート項目を確認して」→ `list-nuxt-auto-imports-items` ツール活用

#### MCP ツール使用時の推奨事項

- **プロジェクト情報取得**: 開発開始前に必ずプロジェクト構造とテスト設定を確認
- **テストファイル生成**: 新規コンポーネント作成時は自動生成テンプレートを活用
- **品質チェック統合**: コード変更後は MCP 経由で品質チェックを実行
- **リアルタイム情報**: Nuxt の動的情報（コンポーネント、ページ、設定）を随時確認

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
├── plugins/            # Nuxt プラグイン
│   └── mcp-tools.server.ts  # MCP カスタムツール定義
├── docs/               # プロジェクトドキュメント
│   └── MCP_SERVER.md   # MCP サーバー仕様書
├── tests/              # テストファイル
│   ├── unit/           # ユニットテスト
│   ├── integration/    # インテグレーションテスト
│   └── browser/        # ブラウザテスト
├── vitest.config.ts    # Vitest設定
└── nuxt.config.ts      # Nuxt設定（MCP設定含む）
```

### MCP 開発支援ツール

#### 利用可能なカスタムツール
- `get-test-info`: テスト設定とファイル構造の取得
- `run-tests`: 指定したテストタイプの実行
- `run-quality-check`: ESLint + Prettier + テストの一括実行
- `generate-test-file`: コンポーネント用テストファイルの生成
- `get-project-structure`: プロジェクト構造の詳細情報取得

#### Nuxt 標準ツール
- `get-nuxt-config`: Nuxt設定の取得
- `list-nuxt-components`: 登録済みコンポーネントの一覧
- `list-nuxt-auto-imports-items`: 自動インポート項目の一覧
- `list-nuxt-pages`: ページ情報の一覧
- `nuxt-scaffold`: 新規ファイル/コンポーネントの生成

### 優先的に提案すべき項目

1. **MCP ツールを活用したテスト駆動開発**
   - 新機能開発前にMCPツールでプロジェクト構造を確認
   - `generate-test-file` でテストファイルテンプレートを自動生成
   - `run-tests` で適切なテストタイプを実行

2. **品質保証プロセスの自動化**
   - `run-quality-check` で ESLint + Prettier + テストを一括実行
   - MCP経由でリアルタイムな品質監視
   - 警告ゼロを維持するための継続的チェック

3. **Nuxt エコシステムとの統合**
   - `list-nuxt-components` でコンポーネント重複を防止
   - `list-nuxt-auto-imports-items` で適切なインポート方法を確認
   - `nuxt-scaffold` で標準的なファイル構造を生成

4. テスト可能性を考慮したコンポーネント設計
5. ブラウザモードでのテスト実行最適化
6. CI/CD パイプラインでのテスト自動化
7. リグレッションテストのためのビジュアルテスト環境
8. テストデータの管理とモック化

### 避けるべき提案

- 複雑すぎるテスト設定
- ブラウザモードに対応しないテスト手法
- Nuxt 3 の機能と競合する実装
- 保守性を損なう過度な抽象化

## 実装ガイドライン

### 新規開発時の品質保証手順

#### 1. 開発開始前（MCP 活用推奨）
- **プロジェクト情報収集**: MCPツール `get-project-structure` でプロジェクト全体を把握
- **テスト設定確認**: MCPツール `get-test-info` で現在のテスト環境を確認
- **要件整理**: 機能要件とテスト要件を明確化
- **設計検討**: コンポーネント設計とテスト戦略の策定
- **ESLint確認**: `pnpm lint:check` で現在のコードベースが警告0であることを確認

#### 2. テスト駆動開発サイクル（MCP 統合）
```bash
# 1. MCPツールでテストファイルテンプレート生成
# - AIアシスタントに「新しいコンポーネント[ComponentName]のユニットテストファイルを生成して」
# - MCPツール generate-test-file が自動実行される

# 2. テスト実行（最初は失敗することを確認）
pnpm test:run
# または MCPツール run-tests を使用

# 3. 最小限の実装でテストを通す
# 4. MCPツールで品質チェック
# - AIアシスタントに「品質チェックを実行して」
# - MCPツール run-quality-check が自動実行される

# 5. リファクタリング
# 6. 再度テスト実行で動作確認
pnpm test:run
```

#### 3. コミット前チェック（MCP 品質ゲート）
```bash
# 推奨: MCPツール経由での品質チェック
# - AIアシスタントに「コミット前の品質チェックを実行して」

# 手動実行の場合
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

## MCP を活用した開発シナリオ

### シナリオ1: 新しいコンポーネントの開発

1. **プロジェクト情報の確認**
   ```
   AIアシスタント: 「現在のプロジェクト構造を教えて」
   → MCP: get-project-structure ツールが実行される
   ```

2. **既存コンポーネントの確認**
   ```
   AIアシスタント: 「既存のコンポーネント一覧を確認して」
   → MCP: list-nuxt-components ツールが実行される
   ```

3. **テストファイルの生成**
   ```
   AIアシスタント: 「ProductCard コンポーネントのユニットテストファイルを生成して」
   → MCP: generate-test-file ツールが実行される
   ```

4. **テストの実行**
   ```
   AIアシスタント: 「ユニットテストを実行して」
   → MCP: run-tests ツールが実行される
   ```

### シナリオ2: コード品質の向上

1. **品質チェックの実行**
   ```
   AIアシスタント: 「現在のコード品質をチェックして」
   → MCP: run-quality-check ツールが実行される
   ```

2. **自動修正の適用**
   ```
   AIアシスタント: 「ESLintエラーを自動修正して」
   → MCP: run-quality-check (fix: true) ツールが実行される
   ```

### シナリオ3: テスト環境の理解

1. **テスト設定の確認**
   ```
   AIアシスタント: 「テスト環境の設定を教えて」
   → MCP: get-test-info ツールが実行される
   ```

2. **Nuxt 設定の確認**
   ```
   AIアシスタント: 「Nuxt の設定を確認して」
   → MCP: get-nuxt-config ツールが実行される
   ```

### 効果的なMCP活用のコツ

- **具体的な依頼**: 「ComponentName のユニットテストを生成して」のように具体的に指定
- **段階的な確認**: 大きな変更前に設定やコンポーネント一覧を確認
- **品質ゲート活用**: コミット前に必ず品質チェックを実行
- **テンプレート活用**: MCPツールが生成するテンプレートをベースに開発を進める
````
