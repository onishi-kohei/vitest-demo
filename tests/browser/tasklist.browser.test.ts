import { test, expect, describe } from "vitest";
import { render } from "vitest-browser-vue";
import { page } from "@vitest/browser/context";
import TaskList from "~/components/TaskList.vue";

describe("TaskList コンポーネント - ブラウザテスト", () => {
  test("タスクリストが表示される", async () => {
    const screen = render(TaskList);

    const taskList = screen.getByTestId("task-list");
    await expect.element(taskList).toBeVisible();

    // 初期タスクが表示される
    await expect.element(screen.getByTestId("task-1")).toBeVisible();
    await expect.element(screen.getByTestId("task-2")).toBeVisible();
    await expect.element(screen.getByTestId("task-3")).toBeVisible();
  });

  test("初期状態のVRT - スクリーンショット", async () => {
    const screen = render(TaskList);

    // TaskListがレンダリングされるまで待機
    const taskList = screen.getByTestId("task-list");
    await expect.element(taskList).toBeVisible();

    // 初期タスクが表示されることを確認
    await expect.element(screen.getByTestId("task-1")).toBeVisible();
    await expect.element(screen.getByTestId("task-2")).toBeVisible();
    await expect.element(screen.getByTestId("task-3")).toBeVisible();

    // VRT用のスクリーンショットを撮影
    await page.screenshot({
      path: "tasklist-initial-state.png",
    });

    // HTMLスナップショットテスト (DOM要素を直接取得)
    if (typeof document !== "undefined") {
      const taskListElement = document.querySelector(
        '[data-testid="task-list"]'
      );
      if (taskListElement) {
        await expect(taskListElement.outerHTML).toMatchSnapshot(
          "tasklist-initial-state.html"
        );
      }
    }
  });
});
