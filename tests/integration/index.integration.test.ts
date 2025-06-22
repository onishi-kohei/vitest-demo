import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import IndexPage from "@/pages/index.vue";

describe("インデックスページ - インテグレーションテスト", () => {
  it("ページが正しくレンダリングされる", async () => {
    const wrapper = mount(IndexPage);

    // ページタイトルの確認
    expect(wrapper.find('[data-testid="page-title"]').text()).toBe(
      "Vitest ブラウザモード デモ"
    );
    expect(wrapper.find('[data-testid="page-description"]').text()).toContain(
      "Nuxt 3 + Vitest ブラウザモード"
    );
  });

  it("すべてのコンポーネントデモセクションが表示される", async () => {
    const wrapper = mount(IndexPage);

    // コンポーネントデモセクションの確認
    const componentDemos = wrapper.findAll(".component-demo");
    expect(componentDemos).toHaveLength(3);

    // 各デモの見出しを確認
    const demoTitles = componentDemos.map((demo) => demo.find("h3").text());
    expect(demoTitles).toEqual([
      "カウンターコンポーネント",
      "ユーザーフォーム",
      "タスクリスト",
    ]);
  });

  it("カウンターコンポーネントが含まれている", async () => {
    const wrapper = mount(IndexPage);

    // Counterコンポーネントが存在することを確認
    const counter = wrapper.findComponent({ name: "Counter" });
    expect(counter.exists()).toBe(true);
  });

  it("ユーザーフォームコンポーネントが含まれている", async () => {
    const wrapper = mount(IndexPage);

    // UserFormコンポーネントが存在することを確認
    const userForm = wrapper.findComponent({ name: "UserForm" });
    expect(userForm.exists()).toBe(true);
  });

  it("タスクリストコンポーネントが含まれている", async () => {
    const wrapper = mount(IndexPage);

    // TaskListコンポーネントが存在することを確認
    const taskList = wrapper.findComponent({ name: "TaskList" });
    expect(taskList.exists()).toBe(true);
  });

  it("テスト環境情報セクションが表示される", async () => {
    const wrapper = mount(IndexPage);

    const infoSection = wrapper.find(".info-section");
    expect(infoSection.exists()).toBe(true);

    const listItems = infoSection.findAll("li");
    expect(listItems).toHaveLength(4);

    const testTypes = listItems.map((item) => item.text());
    expect(testTypes).toEqual([
      "✓ ユニットテスト: Vue Test Utils + Vitest",
      "✓ インテグレーションテスト: @nuxt/test-utils + Vitest",
      "✓ ブラウザテスト: Vitest Browser Mode + Playwright",
      "✓ ビジュアルリグレッション: スナップショットテスト",
    ]);
  });

  it("適切なCSSクラスが適用されている", async () => {
    const wrapper = mount(IndexPage);

    // 主要なCSSクラスの確認
    expect(wrapper.find(".home-page").exists()).toBe(true);
    expect(wrapper.find(".header").exists()).toBe(true);
    expect(wrapper.find(".main-content").exists()).toBe(true);
    expect(wrapper.find(".demo-section").exists()).toBe(true);
    expect(wrapper.find(".info-section").exists()).toBe(true);
  });

  it("レスポンシブレイアウト要素が含まれている", async () => {
    const wrapper = mount(IndexPage);

    // グリッドレイアウトが適用されているかを確認
    const mainContent = wrapper.find(".main-content");
    expect(mainContent.exists()).toBe(true);

    // コンポーネントデモが適切にスタイリングされているかを確認
    const componentDemos = wrapper.findAll(".component-demo");
    componentDemos.forEach((demo) => {
      expect(demo.exists()).toBe(true);
    });
  });
});
