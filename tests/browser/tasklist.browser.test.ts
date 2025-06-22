import { test, expect } from "vitest";
import { page } from "@vitest/browser/context";

test.describe("TaskList コンポーネント - ブラウザテスト", () => {
  test.beforeEach(async () => {
    await page.goto("/");
  });

  test("タスクリストが表示される", async () => {
    const taskSection = page.locator(".component-demo").nth(2);
    await expect(taskSection.locator("h3")).toContainText("タスクリスト");

    const taskList = page.locator('[data-testid="task-list"]');
    await expect(taskList).toBeVisible();

    // 初期タスクが表示される
    await expect(page.locator('[data-testid="task-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="task-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="task-3"]')).toBeVisible();
  });

  test("新しいタスクを追加できる", async () => {
    const newTaskInput = page.locator('[data-testid="new-task-input"]');
    const addBtn = page.locator('[data-testid="add-task-btn"]');
    const totalTasks = page.locator('[data-testid="total-tasks"]');

    // 初期状態の確認
    await expect(totalTasks).toContainText("全 3 件");

    // 新しいタスクを追加
    await newTaskInput.fill("新しいブラウザテストタスク");
    await addBtn.click();

    // タスクが追加されたことを確認
    await expect(totalTasks).toContainText("全 4 件");

    // 入力フィールドがクリアされることを確認
    await expect(newTaskInput).toHaveValue("");

    // 新しいタスクが一番上に表示されることを確認
    const taskItems = page.locator(".task-item");
    const firstTask = taskItems.first();
    await expect(firstTask.locator(".task-label")).toContainText(
      "新しいブラウザテストタスク"
    );
  });

  test("Enterキーでタスクを追加できる", async () => {
    const newTaskInput = page.locator('[data-testid="new-task-input"]');
    const totalTasks = page.locator('[data-testid="total-tasks"]');

    await newTaskInput.fill("Enterキーで追加されるタスク");
    await newTaskInput.press("Enter");

    await expect(totalTasks).toContainText("全 4 件");

    const taskItems = page.locator(".task-item");
    const firstTask = taskItems.first();
    await expect(firstTask.locator(".task-label")).toContainText(
      "Enterキーで追加されるタスク"
    );
  });

  test("タスクの完了状態を切り替えられる", async () => {
    const task2Checkbox = page.locator('[data-testid="task-checkbox-2"]');
    const task2 = page.locator('[data-testid="task-2"]');
    const completedTasks = page.locator('[data-testid="completed-tasks"]');

    // 初期状態では1つ完了
    await expect(completedTasks).toContainText("完了 1 件");

    // タスク2を完了状態にする
    await task2Checkbox.check();
    await expect(completedTasks).toContainText("完了 2 件");
    await expect(task2).toHaveClass(/completed/);

    // タスク2を未完了状態に戻す
    await task2Checkbox.uncheck();
    await expect(completedTasks).toContainText("完了 1 件");
    await expect(task2).not.toHaveClass(/completed/);
  });

  test("タスクを削除できる", async () => {
    const removeBtn = page.locator('[data-testid="remove-task-2"]');
    const task2 = page.locator('[data-testid="task-2"]');
    const totalTasks = page.locator('[data-testid="total-tasks"]');

    // 削除前の確認
    await expect(task2).toBeVisible();
    await expect(totalTasks).toContainText("全 3 件");

    // タスクを削除
    await removeBtn.click();

    // 削除後の確認
    await expect(task2).not.toBeVisible();
    await expect(totalTasks).toContainText("全 2 件");
  });

  test("フィルター機能が動作する", async () => {
    const allFilter = page.locator('[data-testid="filter-all"]');
    const activeFilter = page.locator('[data-testid="filter-active"]');
    const completedFilter = page.locator('[data-testid="filter-completed"]');

    // まずタスク2を完了状態にする
    await page.locator('[data-testid="task-checkbox-2"]').check();

    // 「すべて」フィルター（デフォルト）
    await expect(page.locator(".task-item")).toHaveCount(3);
    await expect(allFilter).toHaveClass(/active/);

    // 「未完了」フィルター
    await activeFilter.click();
    await expect(page.locator(".task-item")).toHaveCount(1);
    await expect(activeFilter).toHaveClass(/active/);
    await expect(allFilter).not.toHaveClass(/active/);

    // 「完了済み」フィルター
    await completedFilter.click();
    await expect(page.locator(".task-item")).toHaveCount(2);
    await expect(completedFilter).toHaveClass(/active/);

    // 「すべて」に戻す
    await allFilter.click();
    await expect(page.locator(".task-item")).toHaveCount(3);
    await expect(allFilter).toHaveClass(/active/);
  });

  test("「すべて完了にする」「すべて未完了にする」機能", async () => {
    const toggleAllBtn = page.locator('[data-testid="check-all-btn"]');
    const completedTasks = page.locator('[data-testid="completed-tasks"]');

    // 初期状態では1つ完了
    await expect(completedTasks).toContainText("完了 1 件");
    await expect(toggleAllBtn).toContainText("すべて完了にする");

    // すべて完了にする
    await toggleAllBtn.click();
    await expect(completedTasks).toContainText("完了 3 件");

    const uncheckAllBtn = page.locator('[data-testid="uncheck-all-btn"]');
    await expect(uncheckAllBtn).toBeVisible();
    await expect(uncheckAllBtn).toContainText("すべて未完了にする");

    // すべて未完了にする
    await uncheckAllBtn.click();
    await expect(completedTasks).toContainText("完了 0 件");
    await expect(page.locator('[data-testid="check-all-btn"]')).toBeVisible();
  });

  test("完了済みタスクを削除する機能", async () => {
    const clearCompletedBtn = page.locator(
      '[data-testid="clear-completed-btn"]'
    );
    const totalTasks = page.locator('[data-testid="total-tasks"]');
    const completedTasks = page.locator('[data-testid="completed-tasks"]');

    // 初期状態では1つ完了（task-1）
    await expect(completedTasks).toContainText("完了 1 件");

    // タスク2も完了状態にする
    await page.locator('[data-testid="task-checkbox-2"]').check();
    await expect(completedTasks).toContainText("完了 2 件");

    // 完了済みを削除
    await clearCompletedBtn.click();

    // 完了していたタスク1と2が削除される
    await expect(page.locator('[data-testid="task-1"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="task-2"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="task-3"]')).toBeVisible();

    await expect(totalTasks).toContainText("全 1 件");
    await expect(completedTasks).toContainText("完了 0 件");
  });

  test("空状態の表示", async () => {
    // すべてのタスクを削除
    await page.locator('[data-testid="remove-task-1"]').click();
    await page.locator('[data-testid="remove-task-2"]').click();
    await page.locator('[data-testid="remove-task-3"]').click();

    // 空状態メッセージが表示される
    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText("タスクがありません");
  });

  test("フィルター別の空状態メッセージ", async () => {
    // すべてのタスクを完了状態にする
    await page.locator('[data-testid="check-all-btn"]').click();

    // 未完了フィルターを適用
    await page.locator('[data-testid="filter-active"]').click();

    // 未完了タスクがない場合のメッセージ
    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText("未完了のタスクはありません");
  });

  test("タスク追加後の統計更新", async () => {
    const newTaskInput = page.locator('[data-testid="new-task-input"]');
    const addBtn = page.locator('[data-testid="add-task-btn"]');
    const totalTasks = page.locator('[data-testid="total-tasks"]');
    const completedTasks = page.locator('[data-testid="completed-tasks"]');

    // 新しいタスクを追加
    await newTaskInput.fill("統計テスト用タスク");
    await addBtn.click();

    // 統計が更新される
    await expect(totalTasks).toContainText("全 4 件");
    await expect(completedTasks).toContainText("完了 1 件"); // 新しいタスクは未完了なので変わらない

    // 新しいタスクを完了状態にする
    const newTaskCheckbox = page
      .locator(".task-item")
      .first()
      .locator('input[type="checkbox"]');
    await newTaskCheckbox.check();

    await expect(completedTasks).toContainText("完了 2 件");
  });

  test("タスクの日付表示", async () => {
    // 各タスクに日付が表示されることを確認
    await expect(page.locator('[data-testid="task-date-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="task-date-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="task-date-3"]')).toBeVisible();
  });

  test("キーボードナビゲーション", async () => {
    const newTaskInput = page.locator('[data-testid="new-task-input"]');

    // 入力フィールドにフォーカス
    await newTaskInput.focus();
    await expect(newTaskInput).toBeFocused();

    // Tabでボタンに移動
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="add-task-btn"]')).toBeFocused();

    // Tabでフィルターボタンに移動
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="filter-all"]')).toBeFocused();
  });

  test("長いタスク名の表示", async () => {
    const newTaskInput = page.locator('[data-testid="new-task-input"]');
    const longTaskName =
      "これは非常に長いタスク名で、UIが適切に処理できるかどうかをテストするためのものです。とても長い説明文が含まれています。";

    await newTaskInput.fill(longTaskName);
    await newTaskInput.press("Enter");

    // 長いタスク名が適切に表示される
    const firstTask = page.locator(".task-item").first();
    await expect(firstTask.locator(".task-label")).toContainText(longTaskName);
  });
});
