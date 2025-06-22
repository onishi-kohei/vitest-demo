import { mount, type VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import UserForm from "@/components/UserForm.vue";

describe("UserForm コンポーネント", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(UserForm);
  });

  describe("初期状態", () => {
    it("すべてのフォームフィールドが空で初期化される", () => {
      expect(
        (wrapper.find('[data-testid="name-input"]').element as HTMLInputElement)
          .value
      ).toBe("");
      expect(
        (
          wrapper.find('[data-testid="email-input"]')
            .element as HTMLInputElement
        ).value
      ).toBe("");
      expect(
        (wrapper.find('[data-testid="age-input"]').element as HTMLInputElement)
          .value
      ).toBe("");
      expect(
        (
          wrapper.find('[data-testid="department-select"]')
            .element as HTMLSelectElement
        ).value
      ).toBe("");
    });

    it("送信ボタンが無効化されている", () => {
      expect(
        (
          wrapper.find('[data-testid="submit-btn"]')
            .element as HTMLButtonElement
        ).disabled
      ).toBe(true);
    });

    it("エラーメッセージが表示されていない", () => {
      expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="age-error"]').exists()).toBe(false);
    });
  });

  describe("バリデーション", () => {
    describe("名前のバリデーション", () => {
      it("名前が空の場合エラーメッセージが表示される", async () => {
        const nameInput = wrapper.find('[data-testid="name-input"]');
        await nameInput.setValue("a");
        await nameInput.setValue("");

        expect(wrapper.find('[data-testid="name-error"]').text()).toBe(
          "名前は必須です"
        );
      });

      it("名前が1文字の場合エラーメッセージが表示される", async () => {
        const nameInput = wrapper.find('[data-testid="name-input"]');
        await nameInput.setValue("a");

        expect(wrapper.find('[data-testid="name-error"]').text()).toBe(
          "名前は2文字以上で入力してください"
        );
      });

      it("名前が2文字以上の場合エラーメッセージが表示されない", async () => {
        const nameInput = wrapper.find('[data-testid="name-input"]');
        await nameInput.setValue("山田太郎");

        // Vue のリアクティブ更新を待つ
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(false);
      });
    });

    describe("メールアドレスのバリデーション", () => {
      it("メールアドレスが空の場合エラーメッセージが表示される", async () => {
        const emailInput = wrapper.find('[data-testid="email-input"]');
        await emailInput.setValue("test");
        await emailInput.setValue("");

        expect(wrapper.find('[data-testid="email-error"]').text()).toBe(
          "メールアドレスは必須です"
        );
      });

      it("無効な形式のメールアドレスの場合エラーメッセージが表示される", async () => {
        const emailInput = wrapper.find('[data-testid="email-input"]');
        await emailInput.setValue("invalid-email");

        expect(wrapper.find('[data-testid="email-error"]').text()).toBe(
          "有効なメールアドレスを入力してください"
        );
      });

      it("有効な形式のメールアドレスの場合エラーメッセージが表示されない", async () => {
        const emailInput = wrapper.find('[data-testid="email-input"]');
        await emailInput.setValue("test@example.com");

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(
          false
        );
      });
    });

    describe("年齢のバリデーション", () => {
      it("年齢が負の値の場合エラーメッセージが表示される", async () => {
        const ageInput = wrapper.find('[data-testid="age-input"]');
        await ageInput.setValue(-1);

        expect(wrapper.find('[data-testid="age-error"]').text()).toBe(
          "年齢は0歳から120歳の間で入力してください"
        );
      });

      it("年齢が120を超える場合エラーメッセージが表示される", async () => {
        const ageInput = wrapper.find('[data-testid="age-input"]');
        await ageInput.setValue(121);

        expect(wrapper.find('[data-testid="age-error"]').text()).toBe(
          "年齢は0歳から120歳の間で入力してください"
        );
      });

      it("年齢が0-120の範囲内の場合エラーメッセージが表示されない", async () => {
        const ageInput = wrapper.find('[data-testid="age-input"]');
        await ageInput.setValue(25);

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-testid="age-error"]').exists()).toBe(false);
      });
    });
  });

  describe("フォーム送信", () => {
    beforeEach(async () => {
      // 有効なデータを入力
      await wrapper.find('[data-testid="name-input"]').setValue("山田太郎");
      await wrapper
        .find('[data-testid="email-input"]')
        .setValue("yamada@example.com");
      await wrapper.find('[data-testid="age-input"]').setValue(30);
      await wrapper
        .find('[data-testid="department-select"]')
        .setValue("engineering");
    });

    it("有効なデータが入力されている場合送信ボタンが有効化される", async () => {
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[data-testid="submit-btn"]').element.disabled).toBe(
        false
      );
    });

    it("フォーム送信時にsubmitイベントが発火される", async () => {
      const form = wrapper.find('[data-testid="user-form"]');
      await form.trigger("submit.prevent");

      // イベントが発火されるまで待つ
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(wrapper.emitted()).toHaveProperty("submit");
      expect(wrapper.emitted().submit[0][0]).toEqual({
        name: "山田太郎",
        email: "yamada@example.com",
        age: 30,
        department: "engineering",
      });
    });

    it("送信中は送信ボタンが無効化される", async () => {
      const submitBtn = wrapper.find('[data-testid="submit-btn"]');
      await submitBtn.trigger("click");

      // Vueの更新を待つ
      await wrapper.vm.$nextTick();

      expect((submitBtn.element as HTMLButtonElement).disabled).toBe(true);
      expect(submitBtn.text()).toBe("送信中...");
    });

    it("送信成功後に成功メッセージが表示される", async () => {
      await wrapper.find('[data-testid="submit-btn"]').trigger("click");

      // 送信処理完了まで待つ
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-testid="success-message"]').exists()).toBe(
        true
      );
      expect(wrapper.find('[data-testid="success-message"]').text()).toBe(
        "ユーザー情報が正常に送信されました！"
      );
    });
  });

  describe("リセット機能", () => {
    it("リセットボタンをクリックするとフォームがクリアされる", async () => {
      // データを入力
      await wrapper.find('[data-testid="name-input"]').setValue("山田太郎");
      await wrapper
        .find('[data-testid="email-input"]')
        .setValue("yamada@example.com");
      await wrapper.find('[data-testid="age-input"]').setValue(30);
      await wrapper
        .find('[data-testid="department-select"]')
        .setValue("engineering");

      // リセット
      await wrapper.find('[data-testid="reset-btn"]').trigger("click");

      expect(wrapper.find('[data-testid="name-input"]').element.value).toBe("");
      expect(wrapper.find('[data-testid="email-input"]').element.value).toBe(
        ""
      );
      expect(wrapper.find('[data-testid="age-input"]').element.value).toBe("");
      expect(
        wrapper.find('[data-testid="department-select"]').element.value
      ).toBe("");
    });

    it("リセット後にエラーメッセージがクリアされる", async () => {
      // エラーを発生させる
      await wrapper.find('[data-testid="name-input"]').setValue("a");

      // 他のフィールドをクリックしてバリデーションを発火
      await wrapper.find('[data-testid="email-input"]').trigger("focus");
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(true);

      // リセット
      await wrapper.find('[data-testid="reset-btn"]').trigger("click");
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(false);
    });
  });

  describe("UI要素", () => {
    it("部署の選択肢が正しく表示される", () => {
      const departmentSelect = wrapper.find(
        '[data-testid="department-select"]'
      );
      const options = departmentSelect.findAll("option");

      expect(options).toHaveLength(6); // 空の選択肢 + 5つの部署
      expect(options[1].text()).toBe("エンジニアリング");
      expect(options[2].text()).toBe("デザイン");
      expect(options[3].text()).toBe("マーケティング");
      expect(options[4].text()).toBe("営業");
      expect(options[5].text()).toBe("人事");
    });

    it("プレースホルダーが正しく設定されている", () => {
      expect(
        wrapper.find('[data-testid="name-input"]').attributes("placeholder")
      ).toBe("山田太郎");
      expect(
        wrapper.find('[data-testid="email-input"]').attributes("placeholder")
      ).toBe("example@email.com");
      expect(
        wrapper.find('[data-testid="age-input"]').attributes("placeholder")
      ).toBe("25");
    });
  });
});
