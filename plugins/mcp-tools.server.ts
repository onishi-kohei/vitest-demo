/**
 * MCP (Model Context Protocol) カスタムツール定義
 * テスト環境に特化したツールを提供
 */

export default defineNuxtPlugin(() => {
  // サーバーサイドでのみ実行
  if (import.meta.client) return;

  // MCP セットアップフック
  const nuxtApp = useNuxtApp();

  nuxtApp.hook("mcp:setup", ({ mcp, nuxt }) => {
    // テストファイル情報を取得するツール
    mcp.tool(
      "get-test-info",
      "プロジェクトのテスト設定とファイル構造を取得します",
      {},
      async () => {
        const testInfo = {
          testFramework: "Vitest",
          testTypes: ["unit", "integration", "browser"],
          testDirectories: ["tests/unit", "tests/integration", "tests/browser"],
          configurations: {
            unit: "vitest.config.ts",
            browser: "vitest.browser.config.ts",
          },
          testCommands: {
            unit: "pnpm test:unit",
            integration: "pnpm test:integration",
            browser: "pnpm test:browser",
            all: "pnpm test:all",
          },
          coverageConfig: {
            enabled: true,
            command: "pnpm test:coverage",
          },
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(testInfo, null, 2),
            },
          ],
        };
      }
    );

    // テスト実行ツール
    mcp.tool(
      "run-tests",
      "テストを実行します",
      {
        testType: {
          type: "string",
          enum: ["unit", "integration", "browser", "all"],
          description: "実行するテストの種類",
        },
        watch: {
          type: "boolean",
          description: "ウォッチモードで実行するか",
          default: false,
        },
      },
      async ({ testType, watch }) => {
        const commands = {
          unit: watch ? "pnpm test:unit --watch" : "pnpm test:run:unit",
          integration: watch
            ? "pnpm test:integration --watch"
            : "pnpm test:run:integration",
          browser: watch
            ? "pnpm test:browser --watch"
            : "pnpm test:run:browser",
          all: "pnpm test:all",
        };

        const command = commands[testType as keyof typeof commands];

        return {
          content: [
            {
              type: "text",
              text: `テスト実行コマンド: ${command}\n\nターミナルで以下を実行してください:\ncd ${nuxt.options.rootDir}\n${command}`,
            },
          ],
        };
      }
    );

    // 品質チェックツール
    mcp.tool(
      "run-quality-check",
      "コード品質チェック（ESLint + Prettier + テスト）を実行します",
      {
        fix: {
          type: "boolean",
          description: "自動修正を実行するか",
          default: false,
        },
      },
      async ({ fix }) => {
        const commands = fix
          ? [
              "pnpm format:lint", // Prettier + ESLint fix
              "pnpm test:run", // 全テスト実行
            ]
          : [
              "pnpm lint:check", // ESLint警告チェック
              "pnpm format:check", // Prettier形式チェック
              "pnpm test:run", // 全テスト実行
            ];

        return {
          content: [
            {
              type: "text",
              text: `品質チェックコマンド:\n${commands.join("\n")}\n\nターミナルで以下を実行してください:\ncd ${nuxt.options.rootDir}\n${commands.join(" && ")}`,
            },
          ],
        };
      }
    );

    // テストファイル生成ツール
    mcp.tool(
      "generate-test-file",
      "コンポーネントまたはページ用のテストファイルを生成します",
      {
        filePath: {
          type: "string",
          description: "テスト対象ファイルのパス（例: components/Counter.vue）",
        },
        testType: {
          type: "string",
          enum: ["unit", "integration", "browser"],
          description: "生成するテストの種類",
        },
      },
      async ({ filePath, testType }) => {
        const fileName =
          filePath.split("/").pop()?.replace(".vue", "") || "Component";
        const testFileName = `${fileName}.${testType}.test.ts`;
        const testDirectory = `tests/${testType}`;

        let testTemplate = "";

        switch (testType) {
          case "unit":
            testTemplate = `import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ${fileName} from "@/${filePath}";

describe("${fileName}", () => {
  it("renders correctly", () => {
    const wrapper = mount(${fileName});
    expect(wrapper.exists()).toBe(true);
  });

  it("has expected props", () => {
    const wrapper = mount(${fileName});
    // プロパティのテストを追加
  });

  it("emits expected events", () => {
    const wrapper = mount(${fileName});
    // イベントのテストを追加
  });
});`;
            break;

          case "integration":
            testTemplate = `import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ${fileName} from "@/${filePath}";

describe("${fileName} Integration", () => {
  it("integrates correctly with other components", () => {
    const wrapper = mount(${fileName});
    // 統合テストを追加
  });

  it("handles data flow correctly", () => {
    const wrapper = mount(${fileName});
    // データフローのテストを追加
  });
});`;
            break;

          case "browser":
            testTemplate = `import { test, expect } from "vitest";
import { page } from "@vitest/browser/context";

test("${fileName} browser interaction", async () => {
  await page.goto("/"); // 適切なパスに変更

  // ブラウザテストを追加
  const element = page.locator('[data-testid="${fileName.toLowerCase()}"]');
  await expect(element).toBeVisible();
});`;
            break;
        }

        return {
          content: [
            {
              type: "text",
              text: `テストファイル生成情報:
ファイル名: ${testFileName}
保存先: ${testDirectory}/${testFileName}

テンプレート:
\`\`\`typescript
${testTemplate}
\`\`\`

ファイルを作成後、以下のコマンドでテストを実行:
pnpm test:${testType}`,
            },
          ],
        };
      }
    );

    // プロジェクト構造情報ツール
    mcp.tool(
      "get-project-structure",
      "プロジェクトのディレクトリ構造とファイル情報を取得します",
      {},
      async () => {
        const structure = {
          projectType: "Nuxt 3 + Vitest Browser Mode",
          framework: "Nuxt 3",
          testFramework: "Vitest",
          directories: {
            components: "Vue コンポーネント",
            composables: "Composition API ユーティリティ",
            pages: "ページコンポーネント",
            tests: {
              unit: "ユニットテスト",
              integration: "インテグレーションテスト",
              browser: "ブラウザテスト",
            },
          },
          configurations: {
            "nuxt.config.ts": "Nuxt設定ファイル",
            "vitest.config.ts": "Vitestユニット・インテグレーションテスト設定",
            "vitest.browser.config.ts": "Vitestブラウザテスト設定",
            "eslint.config.js": "ESLint設定",
            "tsconfig.json": "TypeScript設定",
          },
          features: [
            "TypeScript厳格モード",
            "Vue 3 Composition API",
            "Vitestブラウザモード",
            "ESLint + Prettier",
            "テスト駆動開発(TDD)",
            "リグレッションテスト",
          ],
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(structure, null, 2),
            },
          ],
        };
      }
    );
  });
});
