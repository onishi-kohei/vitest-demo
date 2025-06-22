# MCP (Model Context Protocol) サーバー

このプロジェクトには、[antfu/nuxt-mcp](https://github.com/antfu/nuxt-mcp) をベースとしたMCPサーバーが統合されています。

## 概要

MCPサーバーは、AI開発アシスタント（VSCode、Cursor、Windsurf、Claude Code等）がプロジェクトの構造やテスト環境を理解し、より効果的なサポートを提供できるようにします。

## アクセス情報

- **MCPサーバーURL**: `http://localhost:3000/__mcp/sse`
- **Nuxtドキュメントサーバー**: `https://mcp.nuxt.com/sse`

## 提供されるツール

### 1. プロジェクト情報ツール

#### `get-test-info`

- **説明**: プロジェクトのテスト設定とファイル構造を取得
- **戻り値**: テストフレームワーク、テストタイプ、ディレクトリ構造、コマンド情報

#### `get-project-structure`

- **説明**: プロジェクトのディレクトリ構造とファイル情報を取得
- **戻り値**: プロジェクトタイプ、フレームワーク、設定ファイル、機能一覧

### 2. テスト実行ツール

#### `run-tests`

- **説明**: 指定したタイプのテストを実行
- **パラメータ**:
  - `testType`: `unit` | `integration` | `browser` | `all`
  - `watch`: ウォッチモードの有効/無効
- **戻り値**: 実行すべきコマンド

#### `run-quality-check`

- **説明**: コード品質チェック（ESLint + Prettier + テスト）を実行
- **パラメータ**:
  - `fix`: 自動修正の有効/無効
- **戻り値**: 実行すべきコマンド一覧

### 3. 開発支援ツール

#### `generate-test-file`

- **説明**: コンポーネントまたはページ用のテストファイルを生成
- **パラメータ**:
  - `filePath`: テスト対象ファイルのパス
  - `testType`: `unit` | `integration` | `browser`
- **戻り値**: テストファイルのテンプレートとファイル情報

### 4. Nuxt標準ツール

MCPサーバーはNuxtの標準ツールも提供します：

- `get-nuxt-config`: Nuxt設定の取得
- `list-nuxt-auto-imports-items`: 自動インポート項目の一覧
- `list-nuxt-components`: 登録済みコンポーネントの一覧
- `list-nuxt-pages`: ページ情報の一覧
- `nuxt-scaffold`: 新しいコンポーネント/ページ等の生成

## 設定ファイル

### VSCode / Cursor

```json
{
  "servers": {
    "vitest-demo-nuxt": {
      "type": "sse",
      "url": "http://localhost:3000/__mcp/sse"
    },
    "nuxt-docs": {
      "type": "sse",
      "url": "https://mcp.nuxt.com/sse"
    }
  }
}
```

### 設定場所

- **VSCode**: `.vscode/mcp.json`
- **Cursor**: `.cursor/mcp.json`
- **Windsurf**: `~/.codeium/windsurf/mcp_config.json`
- **Claude Code**: `.mcp.json`

## 使用方法

1. **開発サーバーの起動**:

   ```bash
   pnpm dev
   ```

2. **MCPクライアントでの接続**:

   - サポートされているIDEでMCP設定を有効化
   - MCPサーバーURLに `http://localhost:3000/__mcp/sse` を設定

3. **AIアシスタントでの活用**:
   - 「プロジェクトのテスト構造を教えて」
   - 「ユニットテストを実行して」
   - 「新しいコンポーネントのテストファイルを生成して」
   - 「コード品質チェックを実行して」

## カスタマイズ

`plugins/mcp-tools.server.ts` でカスタムツールを追加できます：

```typescript
nuxtApp.hook("mcp:setup", ({ mcp, nuxt }) => {
  mcp.tool(
    "custom-tool",
    "説明",
    {
      /* パラメータスキーマ */
    },
    async (params) => {
      // ツールの実装
      return {
        content: [
          {
            type: "text",
            text: "結果",
          },
        ],
      };
    }
  );
});
```

## トラブルシューティング

### MCPサーバーが起動しない

1. Nuxt開発サーバーが正常に動作しているか確認
2. `nuxt.config.ts` のMCP設定を確認
3. ポート3000が他のプロセスで使用されていないか確認

### AIアシスタントが接続できない

1. MCPサーバーURL (`http://localhost:3000/__mcp/sse`) にアクセス可能か確認
2. 設定ファイルの形式が正しいか確認
3. IDEのMCP機能が有効になっているか確認

## 参考リンク

- [antfu/nuxt-mcp](https://github.com/antfu/nuxt-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Vitest Documentation](https://vitest.dev/)
