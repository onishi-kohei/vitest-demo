import { mount, type VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import Counter from "@/components/Counter.vue";

describe("Counter コンポーネント", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(Counter);
  });

  describe("初期状態", () => {
    it("カウンターが0で初期化される", () => {
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("0");
    });

    it("すべてのボタンが表示される", () => {
      expect(wrapper.find('[data-testid="increment-btn"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="decrement-btn"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="reset-btn"]').exists()).toBe(true);
    });
  });

  describe("インクリメント機能", () => {
    it("プラスボタンをクリックするとカウンターが1増加する", async () => {
      await wrapper.find('[data-testid="increment-btn"]').trigger("click");
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("1");
    });

    it("プラスボタンを複数回クリックするとカウンターが正しく増加する", async () => {
      const incrementBtn = wrapper.find('[data-testid="increment-btn"]');
      await incrementBtn.trigger("click");
      await incrementBtn.trigger("click");
      await incrementBtn.trigger("click");
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("3");
    });
  });

  describe("デクリメント機能", () => {
    it("マイナスボタンをクリックするとカウンターが1減少する", async () => {
      // まず1にして、その後減らす
      await wrapper.find('[data-testid="increment-btn"]').trigger("click");
      await wrapper.find('[data-testid="decrement-btn"]').trigger("click");
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("0");
    });

    it("負の値にもできる", async () => {
      await wrapper.find('[data-testid="decrement-btn"]').trigger("click");
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("-1");
    });
  });

  describe("リセット機能", () => {
    it("リセットボタンをクリックするとカウンターが0になる", async () => {
      // カウンターを5にする
      const incrementBtn = wrapper.find('[data-testid="increment-btn"]');
      for (let i = 0; i < 5; i++) {
        await incrementBtn.trigger("click");
      }
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("5");

      // リセット
      await wrapper.find('[data-testid="reset-btn"]').trigger("click");
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("0");
    });

    it("負の値からリセットしても0になる", async () => {
      // カウンターを-3にする
      const decrementBtn = wrapper.find('[data-testid="decrement-btn"]');
      for (let i = 0; i < 3; i++) {
        await decrementBtn.trigger("click");
      }
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("-3");

      // リセット
      await wrapper.find('[data-testid="reset-btn"]').trigger("click");
      expect(wrapper.find('[data-testid="counter-value"]').text()).toBe("0");
    });
  });

  describe("UI状態のテスト", () => {
    it("ボタンのクラスが正しく設定されている", () => {
      expect(wrapper.find('[data-testid="increment-btn"]').classes()).toContain(
        "btn-primary"
      );
      expect(wrapper.find('[data-testid="decrement-btn"]').classes()).toContain(
        "btn-secondary"
      );
      expect(wrapper.find('[data-testid="reset-btn"]').classes()).toContain(
        "btn-danger"
      );
    });

    it("カウンター表示エリアが正しくレンダリングされる", () => {
      const counterDisplay = wrapper.find(".counter-display");
      expect(counterDisplay.exists()).toBe(true);
      expect(
        counterDisplay.find('[data-testid="counter-value"]').exists()
      ).toBe(true);
    });
  });

  describe("アクセシビリティ", () => {
    it("ボタンにdata-testid属性が設定されている", () => {
      expect(
        wrapper.find('[data-testid="increment-btn"]').attributes("data-testid")
      ).toBe("increment-btn");
      expect(
        wrapper.find('[data-testid="decrement-btn"]').attributes("data-testid")
      ).toBe("decrement-btn");
      expect(
        wrapper.find('[data-testid="reset-btn"]').attributes("data-testid")
      ).toBe("reset-btn");
    });
  });
});
