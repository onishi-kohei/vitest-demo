import { mount, type VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import TaskList from "@/components/TaskList.vue";

describe("TaskList コンポーネント", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(TaskList);
  });

  describe("初期状態", () => {
    it("初期タスクが表示される", () => {
      expect(wrapper.find('[data-testid="task-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-3"]').exists()).toBe(true);
    });

    it("タスク統計が正しく表示される", () => {
      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 3 件"
      );
      expect(wrapper.find('[data-testid="completed-tasks"]').text()).toBe(
        "完了 1 件"
      );
    });

    it("新しいタスク入力フィールドが表示される", () => {
      expect(wrapper.find('[data-testid="new-task-input"]').exists()).toBe(
        true
      );
      expect(wrapper.find('[data-testid="add-task-btn"]').exists()).toBe(true);
    });

    it("フィルターボタンが表示される", () => {
      expect(wrapper.find('[data-testid="filter-all"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="filter-active"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="filter-completed"]').exists()).toBe(
        true
      );
    });
  });

  describe("タスク追加機能", () => {
    it("新しいタスクを追加できる", async () => {
      const input = wrapper.find('[data-testid="new-task-input"]');
      const addBtn = wrapper.find('[data-testid="add-task-btn"]');

      await input.setValue("新しいタスク");
      await addBtn.trigger("click");

      // 新しいタスクが一番上に追加される
      const taskItems = wrapper.findAll('[data-testid^="task-"]');
      expect(taskItems[0].find('[data-testid^="task-label-"]').text()).toBe(
        "新しいタスク"
      );
      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 4 件"
      );
    });

    it("Enterキーでタスクを追加できる", async () => {
      const input = wrapper.find('[data-testid="new-task-input"]');

      await input.setValue("Enterで追加されるタスク");
      await input.trigger("keyup.enter");

      const taskItems = wrapper.findAll('[data-testid^="task-"]');
      expect(taskItems[0].find('[data-testid^="task-label-"]').text()).toBe(
        "Enterで追加されるタスク"
      );
    });

    it("空文字のタスクは追加できない", async () => {
      const input = wrapper.find('[data-testid="new-task-input"]');
      const addBtn = wrapper.find('[data-testid="add-task-btn"]');

      await input.setValue("   "); // 空白文字
      await addBtn.trigger("click");

      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 3 件"
      ); // 変わらない
    });

    it("タスク追加後に入力フィールドがクリアされる", async () => {
      const input = wrapper.find('[data-testid="new-task-input"]');
      const addBtn = wrapper.find('[data-testid="add-task-btn"]');

      await input.setValue("テストタスク");
      await addBtn.trigger("click");

      expect(input.element.value).toBe("");
    });
  });

  describe("タスク完了機能", () => {
    it("タスクのチェックボックスをクリックすると完了状態が切り替わる", async () => {
      const checkbox = wrapper.find('[data-testid="task-checkbox-2"]');

      // 初期状態では未完了
      expect(checkbox.element.checked).toBe(false);

      await checkbox.setChecked(true);
      expect(checkbox.element.checked).toBe(true);

      // 完了数の更新を確認
      expect(wrapper.find('[data-testid="completed-tasks"]').text()).toBe(
        "完了 2 件"
      );
    });

    it("完了したタスクにはcompletedクラスが付与される", async () => {
      const task2 = wrapper.find('[data-testid="task-2"]');
      const checkbox = wrapper.find('[data-testid="task-checkbox-2"]');

      expect(task2.classes()).not.toContain("opacity-70");

      await checkbox.setChecked(true);
      expect(task2.classes()).toContain("opacity-70");
    });
  });

  describe("タスク削除機能", () => {
    it("削除ボタンをクリックするとタスクが削除される", async () => {
      const removeBtn = wrapper.find('[data-testid="remove-task-2"]');

      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(true);

      await removeBtn.trigger("click");

      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 2 件"
      );
    });
  });

  describe("フィルター機能", () => {
    beforeEach(async () => {
      // タスク2を完了状態にする
      await wrapper.find('[data-testid="task-checkbox-2"]').setChecked(true);
    });

    it("「すべて」フィルターでは全タスクが表示される", async () => {
      await wrapper.find('[data-testid="filter-all"]').trigger("click");

      // タスクコンテナ内の実際のタスクアイテムをカウント
      const taskItems = wrapper.findAll(
        '[data-testid="task-1"], [data-testid="task-2"], [data-testid="task-3"]'
      );
      expect(taskItems).toHaveLength(3);
    });

    it("「未完了」フィルターでは未完了タスクのみ表示される", async () => {
      await wrapper.find('[data-testid="filter-active"]').trigger("click");
      await wrapper.vm.$nextTick();

      // beforeEachでtask-2を完了状態にしているため、task-3のみが未完了として表示される
      expect(wrapper.find('[data-testid="task-3"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-1"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(false);
    });

    it("「完了済み」フィルターでは完了タスクのみ表示される", async () => {
      await wrapper.find('[data-testid="filter-completed"]').trigger("click");
      await wrapper.vm.$nextTick();

      // beforeEachでtask-2を完了状態にしているため、task-1とtask-2が完了済みとして表示される
      expect(wrapper.find('[data-testid="task-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-3"]').exists()).toBe(false);
    });

    it("アクティブなフィルターボタンにactiveクラスが付与される", async () => {
      const activeFilter = wrapper.find('[data-testid="filter-active"]');
      const allFilter = wrapper.find('[data-testid="filter-all"]');

      // 初期状態では「すべて」がアクティブ
      expect(allFilter.classes()).toContain("bg-blue-600");
      expect(activeFilter.classes()).not.toContain("bg-blue-600");

      await activeFilter.trigger("click");

      expect(activeFilter.classes()).toContain("bg-blue-600");
      expect(allFilter.classes()).not.toContain("bg-blue-600");
    });
  });

  describe("一括操作", () => {
    it("「すべて完了にする」ボタンで全タスクを完了状態にできる", async () => {
      const toggleAllBtn = wrapper.find('[data-testid="check-all-btn"]');

      await toggleAllBtn.trigger("click");

      expect(wrapper.find('[data-testid="completed-tasks"]').text()).toBe(
        "完了 3 件"
      );
      expect(wrapper.find('[data-testid="uncheck-all-btn"]').exists()).toBe(
        true
      );
    });

    it("「すべて未完了にする」ボタンで全タスクを未完了状態にできる", async () => {
      // まずすべて完了にする
      await wrapper.find('[data-testid="check-all-btn"]').trigger("click");

      // その後すべて未完了にする
      const uncheckAllBtn = wrapper.find('[data-testid="uncheck-all-btn"]');
      await uncheckAllBtn.trigger("click");

      expect(wrapper.find('[data-testid="completed-tasks"]').text()).toBe(
        "完了 0 件"
      );
      expect(wrapper.find('[data-testid="check-all-btn"]').exists()).toBe(true);
    });

    it("「完了済みを削除」ボタンで完了タスクを削除できる", async () => {
      // タスク2を完了状態にする
      await wrapper.find('[data-testid="task-checkbox-2"]').setChecked(true);

      const clearBtn = wrapper.find('[data-testid="clear-completed-btn"]');
      await clearBtn.trigger("click");

      // 完了していたタスク1とタスク2が削除される
      expect(wrapper.find('[data-testid="task-1"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="task-3"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 1 件"
      );
    });

    it("完了済みタスクがない場合は「完了済みを削除」ボタンが無効化される", async () => {
      // すべてのタスクを未完了にする
      await wrapper.find('[data-testid="task-checkbox-1"]').setChecked(false);

      const clearBtn = wrapper.find('[data-testid="clear-completed-btn"]');
      expect(clearBtn.element.disabled).toBe(true);
    });
  });

  describe("空状態の表示", () => {
    it("タスクがない場合は空状態メッセージが表示される", async () => {
      // すべてのタスクを削除
      await wrapper.find('[data-testid="remove-task-1"]').trigger("click");
      await wrapper.find('[data-testid="remove-task-2"]').trigger("click");
      await wrapper.find('[data-testid="remove-task-3"]').trigger("click");

      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="empty-state"]').text()).toContain(
        "タスクがありません"
      );
    });

    it("未完了フィルターで未完了タスクがない場合は適切なメッセージが表示される", async () => {
      // すべてのタスクを完了にする
      await wrapper.find('[data-testid="check-all-btn"]').trigger("click");

      // 未完了フィルターを適用
      await wrapper.find('[data-testid="filter-active"]').trigger("click");

      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="empty-state"]').text()).toContain(
        "未完了のタスクはありません"
      );
    });
  });

  describe("日付表示", () => {
    it("タスクの作成日が表示される", () => {
      // 初期タスクの日付表示を確認
      expect(wrapper.find('[data-testid="task-date-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-date-2"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-date-3"]').exists()).toBe(true);
    });
  });
});
