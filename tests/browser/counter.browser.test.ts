import { test, expect } from "vitest";
import { page } from "@vitest/browser/context";

test.describe("Counter コンポーネント - ブラウザテスト", () => {
  test.beforeEach(async () => {
    await page.goto("/");
  });

  test("カウンターコンポーネントが表示される", async () => {
    const counterSection = page.locator(".component-demo").first();
    await expect(counterSection.locator("h3")).toContainText(
      "カウンターコンポーネント"
    );

    const counterValue = page.locator('[data-testid="counter-value"]');
    await expect(counterValue).toBeVisible();
    await expect(counterValue).toContainText("0");
  });

  test("インクリメントボタンのクリックでカウンターが増加する", async () => {
    const incrementBtn = page.locator('[data-testid="increment-btn"]');
    const counterValue = page.locator('[data-testid="counter-value"]');

    await incrementBtn.click();
    await expect(counterValue).toContainText("1");

    await incrementBtn.click();
    await expect(counterValue).toContainText("2");

    await incrementBtn.click();
    await expect(counterValue).toContainText("3");
  });

  test("デクリメントボタンのクリックでカウンターが減少する", async () => {
    const incrementBtn = page.locator('[data-testid="increment-btn"]');
    const decrementBtn = page.locator('[data-testid="decrement-btn"]');
    const counterValue = page.locator('[data-testid="counter-value"]');

    // まず5まで増やす
    for (let i = 0; i < 5; i++) {
      await incrementBtn.click();
    }
    await expect(counterValue).toContainText("5");

    // 2回減らす
    await decrementBtn.click();
    await expect(counterValue).toContainText("4");

    await decrementBtn.click();
    await expect(counterValue).toContainText("3");
  });

  test("リセットボタンでカウンターが0になる", async () => {
    const incrementBtn = page.locator('[data-testid="increment-btn"]');
    const resetBtn = page.locator('[data-testid="reset-btn"]');
    const counterValue = page.locator('[data-testid="counter-value"]');

    // カウンターを7まで増やす
    for (let i = 0; i < 7; i++) {
      await incrementBtn.click();
    }
    await expect(counterValue).toContainText("7");

    // リセット
    await resetBtn.click();
    await expect(counterValue).toContainText("0");
  });

  test("負の値でもカウンターが機能する", async () => {
    const decrementBtn = page.locator('[data-testid="decrement-btn"]');
    const resetBtn = page.locator('[data-testid="reset-btn"]');
    const counterValue = page.locator('[data-testid="counter-value"]');

    // 負の値まで減らす
    for (let i = 0; i < 3; i++) {
      await decrementBtn.click();
    }
    await expect(counterValue).toContainText("-3");

    // リセットで0に戻る
    await resetBtn.click();
    await expect(counterValue).toContainText("0");
  });

  test("ボタンのホバー効果が機能する", async () => {
    const incrementBtn = page.locator('[data-testid="increment-btn"]');

    // ホバー前の状態をチェック
    await expect(incrementBtn).toBeVisible();

    // ホバー
    await incrementBtn.hover();

    // ホバー後もボタンが機能することを確認
    await incrementBtn.click();
    const counterValue = page.locator('[data-testid="counter-value"]');
    await expect(counterValue).toContainText("1");
  });

  test("キーボードナビゲーションが機能する", async () => {
    const incrementBtn = page.locator('[data-testid="increment-btn"]');
    const decrementBtn = page.locator('[data-testid="decrement-btn"]');
    const resetBtn = page.locator('[data-testid="reset-btn"]');
    const counterValue = page.locator('[data-testid="counter-value"]');

    // Tabキーでボタン間を移動
    await incrementBtn.focus();
    await page.keyboard.press("Enter");
    await expect(counterValue).toContainText("1");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(counterValue).toContainText("0");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(counterValue).toContainText("0"); // リセットボタン
  });

  test("連続クリックでのパフォーマンス", async () => {
    const incrementBtn = page.locator('[data-testid="increment-btn"]');
    const counterValue = page.locator('[data-testid="counter-value"]');

    // 10回連続クリック
    for (let i = 0; i < 10; i++) {
      await incrementBtn.click();
    }

    await expect(counterValue).toContainText("10");
  });
});
