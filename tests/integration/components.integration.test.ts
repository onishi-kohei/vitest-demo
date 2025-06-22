import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";
import UserForm from "@/components/UserForm.vue";
import TaskList from "@/components/TaskList.vue";

describe("コンポーネント間の統合テスト", () => {
  describe("複数コンポーネントの同時動作", () => {
    it("異なるコンポーネントが独立して動作する", async () => {
      // 複数のコンポーネントをマウント
      const counterWrapper = mount(Counter);
      const userFormWrapper = mount(UserForm);
      const taskListWrapper = mount(TaskList);

      // 各コンポーネントが独立して初期化される
      expect(counterWrapper.find('[data-testid="counter-value"]').text()).toBe(
        "0"
      );
      expect(
        userFormWrapper.find('[data-testid="name-input"]').element.value
      ).toBe("");
      expect(taskListWrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 3 件"
      );

      // 各コンポーネントが独立して動作する
      await counterWrapper
        .find('[data-testid="increment-btn"]')
        .trigger("click");
      expect(counterWrapper.find('[data-testid="counter-value"]').text()).toBe(
        "1"
      );

      await userFormWrapper
        .find('[data-testid="name-input"]')
        .setValue("テスト");
      expect(
        userFormWrapper.find('[data-testid="name-input"]').element.value
      ).toBe("テスト");

      await taskListWrapper
        .find('[data-testid="new-task-input"]')
        .setValue("新タスク");
      await taskListWrapper
        .find('[data-testid="add-task-btn"]')
        .trigger("click");
      expect(taskListWrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 4 件"
      );
    });
  });

  describe("イベント処理の統合テスト", () => {
    it("UserFormのsubmitイベントが適切に処理される", async () => {
      const mockHandler = vi.fn();
      const wrapper = mount(UserForm, {
        attrs: {
          onSubmit: mockHandler,
        },
      });

      // 有効なデータを入力
      await wrapper.find('[data-testid="name-input"]').setValue("山田太郎");
      await wrapper
        .find('[data-testid="email-input"]')
        .setValue("yamada@example.com");
      await wrapper.find('[data-testid="age-input"]').setValue(30);

      // フォーム送信
      await wrapper.find('[data-testid="submit-btn"]').trigger("click");

      // 送信処理完了まで待つ
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // イベントハンドラーが呼ばれることを確認
      expect(mockHandler).toHaveBeenCalledWith({
        name: "山田太郎",
        email: "yamada@example.com",
        age: 30,
        department: "",
      });
    });
  });

  describe("状態管理の統合テスト", () => {
    it("TaskListの状態が適切に管理される", async () => {
      const wrapper = mount(TaskList);

      // 初期状態の確認
      const initialTotalTasks = wrapper
        .find('[data-testid="total-tasks"]')
        .text();
      const initialCompletedTasks = wrapper
        .find('[data-testid="completed-tasks"]')
        .text();

      expect(initialTotalTasks).toBe("全 3 件");
      expect(initialCompletedTasks).toBe("完了 1 件");

      // タスクを追加
      await wrapper
        .find('[data-testid="new-task-input"]')
        .setValue("統合テストタスク");
      await wrapper.find('[data-testid="add-task-btn"]').trigger("click");

      // 統計が更新される
      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 4 件"
      );
      expect(wrapper.find('[data-testid="completed-tasks"]').text()).toBe(
        "完了 1 件"
      );

      // 新しいタスクを完了状態にする
      const newTaskCheckbox = wrapper
        .findAll(".task-item")[0]
        .find('input[type="checkbox"]');
      await newTaskCheckbox.setChecked(true);

      // 完了数が更新される
      expect(wrapper.find('[data-testid="completed-tasks"]').text()).toBe(
        "完了 2 件"
      );
    });
  });

  describe("アクセシビリティの統合テスト", () => {
    it("すべてのコンポーネントで適切なdata-testid属性が設定されている", () => {
      const counterWrapper = mount(Counter);
      const userFormWrapper = mount(UserForm);
      const taskListWrapper = mount(TaskList);

      // Counter コンポーネント
      expect(
        counterWrapper.find('[data-testid="counter-value"]').exists()
      ).toBe(true);
      expect(
        counterWrapper.find('[data-testid="increment-btn"]').exists()
      ).toBe(true);
      expect(
        counterWrapper.find('[data-testid="decrement-btn"]').exists()
      ).toBe(true);
      expect(counterWrapper.find('[data-testid="reset-btn"]').exists()).toBe(
        true
      );

      // UserForm コンポーネント
      expect(userFormWrapper.find('[data-testid="user-form"]').exists()).toBe(
        true
      );
      expect(userFormWrapper.find('[data-testid="name-input"]').exists()).toBe(
        true
      );
      expect(userFormWrapper.find('[data-testid="email-input"]').exists()).toBe(
        true
      );
      expect(userFormWrapper.find('[data-testid="submit-btn"]').exists()).toBe(
        true
      );

      // TaskList コンポーネント
      expect(taskListWrapper.find('[data-testid="task-list"]').exists()).toBe(
        true
      );
      expect(
        taskListWrapper.find('[data-testid="new-task-input"]').exists()
      ).toBe(true);
      expect(
        taskListWrapper.find('[data-testid="add-task-btn"]').exists()
      ).toBe(true);
      expect(taskListWrapper.find('[data-testid="total-tasks"]').exists()).toBe(
        true
      );
    });

    it("フォーム要素のラベル関連付けが適切に設定されている", () => {
      const userFormWrapper = mount(UserForm);

      // ラベルとinputの関連付けを確認
      const nameInput = userFormWrapper.find("#name");
      const emailInput = userFormWrapper.find("#email");
      const ageInput = userFormWrapper.find("#age");
      const departmentSelect = userFormWrapper.find("#department");

      expect(nameInput.exists()).toBe(true);
      expect(emailInput.exists()).toBe(true);
      expect(ageInput.exists()).toBe(true);
      expect(departmentSelect.exists()).toBe(true);

      // 対応するlabelが存在することを確認
      expect(userFormWrapper.find('label[for="name"]').exists()).toBe(true);
      expect(userFormWrapper.find('label[for="email"]').exists()).toBe(true);
      expect(userFormWrapper.find('label[for="age"]').exists()).toBe(true);
      expect(userFormWrapper.find('label[for="department"]').exists()).toBe(
        true
      );
    });
  });

  describe("パフォーマンス関連の統合テスト", () => {
    it("大量のタスクを追加してもパフォーマンスが維持される", async () => {
      const wrapper = mount(TaskList);
      const addBtn = wrapper.find('[data-testid="add-task-btn"]');
      const newTaskInput = wrapper.find('[data-testid="new-task-input"]');

      const startTime = performance.now();

      // 10個のタスクを追加
      for (let i = 0; i < 10; i++) {
        await newTaskInput.setValue(`パフォーマンステストタスク ${i + 1}`);
        await addBtn.trigger("click");
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 実行時間が妥当な範囲内であることを確認（1秒未満）
      expect(executionTime).toBeLessThan(1000);

      // すべてのタスクが正しく追加されることを確認
      expect(wrapper.find('[data-testid="total-tasks"]').text()).toBe(
        "全 13 件"
      );
    });

    it("Counterの連続クリックでのパフォーマンス", async () => {
      const wrapper = mount(Counter);
      const incrementBtn = wrapper.find('[data-testid="increment-btn"]');

      const startTime = performance.now();

      // 50回連続クリック
      for (let i = 0; i < 50; i++) {
        await incrementBtn.trigger("click");
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 実行時間が妥当な範囲内であることを確認
      expect(executionTime).toBeLessThan(2000);

      // カウンターが正しく更新されることを確認
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("50");
    });
  });

  describe("エラーハンドリングの統合テスト", () => {
    it("UserFormで無効なデータでも適切にハンドリングされる", async () => {
      const wrapper = mount(UserForm);

      // 無効なデータを入力
      await wrapper.find('[data-testid="name-input"]').setValue("");
      await wrapper
        .find('[data-testid="email-input"]')
        .setValue("invalid-email");
      await wrapper.find('[data-testid="age-input"]').setValue(-5);

      // 送信ボタンが無効化されることを確認
      expect(wrapper.find('[data-testid="submit-btn"]').element.disabled).toBe(
        true
      );

      // エラーメッセージが表示されることを確認
      // フィールドをblurしてバリデーションを発火
      await wrapper.find('[data-testid="name-input"]').trigger("blur");
      await wrapper.find('[data-testid="email-input"]').trigger("blur");
      await wrapper.find('[data-testid="age-input"]').trigger("blur");

      await wrapper.vm.$nextTick();

      // エラーメッセージの存在を確認
      expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="age-error"]').exists()).toBe(true);
    });
  });

  describe("リアクティブな更新の統合テスト", () => {
    it("TaskListでフィルターとタスク状態の連携が適切に動作する", async () => {
      const wrapper = mount(TaskList);

      // 初期状態の確認
      expect(wrapper.findAll(".task-item")).toHaveLength(3);

      // タスク2を完了状態にする
      await wrapper.find('[data-testid="task-checkbox-2"]').setChecked(true);

      // 未完了フィルターに切り替え
      await wrapper.find('[data-testid="filter-active"]').trigger("click");

      // 未完了タスクのみ表示される
      expect(wrapper.findAll(".task-item")).toHaveLength(1);
      expect(wrapper.find('[data-testid="task-3"]').exists()).toBe(true);

      // 完了済みフィルターに切り替え
      await wrapper.find('[data-testid="filter-completed"]').trigger("click");

      // 完了タスクのみ表示される
      expect(wrapper.findAll(".task-item")).toHaveLength(2);
      expect(wrapper.find('[data-testid="task-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="task-2"]').exists()).toBe(true);
    });
  });
});
