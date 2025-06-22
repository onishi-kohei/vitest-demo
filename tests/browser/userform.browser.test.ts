import { test, expect } from "vitest";
import { page } from "@vitest/browser/context";

test.describe("UserForm コンポーネント - ブラウザテスト", () => {
  test.beforeEach(async () => {
    await page.goto("/");
  });

  test("ユーザーフォームが表示される", async () => {
    const formSection = page.locator(".component-demo").nth(1);
    await expect(formSection.locator("h3")).toContainText("ユーザーフォーム");

    const form = page.locator('[data-testid="user-form"]');
    await expect(form).toBeVisible();

    // すべてのフィールドが表示される
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="age-input"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="department-select"]')
    ).toBeVisible();
  });

  test("フォームの入力と送信が機能する", async () => {
    // フォームフィールドに入力
    await page.locator('[data-testid="name-input"]').fill("山田太郎");
    await page
      .locator('[data-testid="email-input"]')
      .fill("yamada@example.com");
    await page.locator('[data-testid="age-input"]').fill("30");
    await page
      .locator('[data-testid="department-select"]')
      .selectOption("engineering");

    // 送信ボタンが有効化されることを確認
    const submitBtn = page.locator('[data-testid="submit-btn"]');
    await expect(submitBtn).toBeEnabled();

    // フォーム送信
    await submitBtn.click();

    // 送信中の状態を確認
    await expect(submitBtn).toContainText("送信中...");
    await expect(submitBtn).toBeDisabled();

    // 送信完了後の成功メッセージを確認
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(
      "ユーザー情報が正常に送信されました！"
    );
  });

  test("バリデーションエラーが表示される", async () => {
    // 名前フィールドに1文字だけ入力
    await page.locator('[data-testid="name-input"]').fill("a");

    // 他のフィールドをクリックしてバリデーションを発火
    await page.locator('[data-testid="email-input"]').click();

    // エラーメッセージが表示される
    const nameError = page.locator('[data-testid="name-error"]');
    await expect(nameError).toBeVisible();
    await expect(nameError).toContainText("名前は2文字以上で入力してください");

    // 無効なメールアドレスを入力
    await page.locator('[data-testid="email-input"]').fill("invalid-email");
    await page.locator('[data-testid="age-input"]').click();

    const emailError = page.locator('[data-testid="email-error"]');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(
      "有効なメールアドレスを入力してください"
    );

    // 送信ボタンが無効のままであることを確認
    const submitBtn = page.locator('[data-testid="submit-btn"]');
    await expect(submitBtn).toBeDisabled();
  });

  test("年齢フィールドのバリデーション", async () => {
    // 負の値を入力
    await page.locator('[data-testid="age-input"]').fill("-5");
    await page.locator('[data-testid="name-input"]').click();

    const ageError = page.locator('[data-testid="age-error"]');
    await expect(ageError).toBeVisible();
    await expect(ageError).toContainText(
      "年齢は0歳から120歳の間で入力してください"
    );

    // 有効な値に修正
    await page.locator('[data-testid="age-input"]').fill("25");
    await page.locator('[data-testid="name-input"]').click();

    // エラーメッセージが消える
    await expect(ageError).not.toBeVisible();
  });

  test("部署選択機能", async () => {
    const departmentSelect = page.locator('[data-testid="department-select"]');

    // 初期状態では空
    await expect(departmentSelect).toHaveValue("");

    // 各部署を選択してみる
    await departmentSelect.selectOption("engineering");
    await expect(departmentSelect).toHaveValue("engineering");

    await departmentSelect.selectOption("design");
    await expect(departmentSelect).toHaveValue("design");

    await departmentSelect.selectOption("marketing");
    await expect(departmentSelect).toHaveValue("marketing");
  });

  test("リセット機能", async () => {
    // フォームに入力
    await page.locator('[data-testid="name-input"]').fill("田中花子");
    await page
      .locator('[data-testid="email-input"]')
      .fill("tanaka@example.com");
    await page.locator('[data-testid="age-input"]').fill("28");
    await page
      .locator('[data-testid="department-select"]')
      .selectOption("design");

    // 入力内容を確認
    await expect(page.locator('[data-testid="name-input"]')).toHaveValue(
      "田中花子"
    );
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue(
      "tanaka@example.com"
    );
    await expect(page.locator('[data-testid="age-input"]')).toHaveValue("28");
    await expect(page.locator('[data-testid="department-select"]')).toHaveValue(
      "design"
    );

    // リセットボタンをクリック
    await page.locator('[data-testid="reset-btn"]').click();

    // すべてのフィールドがクリアされる
    await expect(page.locator('[data-testid="name-input"]')).toHaveValue("");
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue("");
    await expect(page.locator('[data-testid="age-input"]')).toHaveValue("");
    await expect(page.locator('[data-testid="department-select"]')).toHaveValue(
      ""
    );
  });

  test("フォームのアクセシビリティ", async () => {
    // ラベルとフィールドの関連付けを確認
    const nameInput = page.locator('[data-testid="name-input"]');
    const nameLabel = page.locator('label[for="name"]');

    await expect(nameLabel).toBeVisible();
    await expect(nameLabel).toContainText("名前:");

    // フォーカス機能を確認
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    // Tabナビゲーション
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="age-input"]')).toBeFocused();
  });

  test("プレースホルダーテキストが表示される", async () => {
    await expect(page.locator('[data-testid="name-input"]')).toHaveAttribute(
      "placeholder",
      "山田太郎"
    );
    await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute(
      "placeholder",
      "example@email.com"
    );
    await expect(page.locator('[data-testid="age-input"]')).toHaveAttribute(
      "placeholder",
      "25"
    );
  });

  test("リアルタイムバリデーション", async () => {
    const nameInput = page.locator('[data-testid="name-input"]');
    const nameError = page.locator('[data-testid="name-error"]');

    // 1文字入力してエラーが表示される
    await nameInput.fill("a");
    await page.locator('[data-testid="email-input"]').click();
    await expect(nameError).toBeVisible();

    // 2文字以上に修正してエラーが消える
    await nameInput.fill("ab");
    await page.locator('[data-testid="email-input"]').click();
    await expect(nameError).not.toBeVisible();
  });

  test("フォーム送信後の状態管理", async () => {
    // 有効なデータを入力
    await page.locator('[data-testid="name-input"]').fill("佐藤次郎");
    await page.locator('[data-testid="email-input"]').fill("sato@example.com");
    await page.locator('[data-testid="age-input"]').fill("35");
    await page
      .locator('[data-testid="department-select"]')
      .selectOption("sales");

    // 送信
    await page.locator('[data-testid="submit-btn"]').click();

    // 送信完了後、成功メッセージが3秒後に消えることを確認
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();

    // 3秒待って成功メッセージが消えることを確認
    await page.waitForTimeout(3100);
    await expect(successMessage).not.toBeVisible();
  });
});
