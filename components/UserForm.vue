<template>
  <form
    class="max-w-sm mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    data-testid="user-form"
    @submit.prevent="handleSubmit"
  >
    <h3 class="text-gray-800 mb-6 text-center text-xl font-semibold">ユーザー情報入力</h3>

    <div class="mb-6">
      <label for="name" class="block mb-2 font-medium text-gray-700">名前:</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        data-testid="name-input"
        required
        class="w-full px-3 py-3 border border-gray-300 rounded text-base transition-colors duration-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        placeholder="山田太郎"
      >
      <span v-if="errors.name" class="block mt-2 text-red-600 text-sm" data-testid="name-error">
        {{ errors.name }}
      </span>
    </div>

    <div class="mb-6">
      <label for="email" class="block mb-2 font-medium text-gray-700">メールアドレス:</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        data-testid="email-input"
        required
        class="w-full px-3 py-3 border border-gray-300 rounded text-base transition-colors duration-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        placeholder="example@email.com"
      >
      <span v-if="errors.email" class="block mt-2 text-red-600 text-sm" data-testid="email-error">
        {{ errors.email }}
      </span>
    </div>

    <div class="mb-6">
      <label for="age" class="block mb-2 font-medium text-gray-700">年齢:</label>
      <input
        id="age"
        v-model.number="form.age"
        type="number"
        data-testid="age-input"
        min="0"
        max="120"
        class="w-full px-3 py-3 border border-gray-300 rounded text-base transition-colors duration-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        placeholder="25"
      >
      <span v-if="errors.age" class="block mt-2 text-red-600 text-sm" data-testid="age-error">
        {{ errors.age }}
      </span>
    </div>

    <div class="mb-6">
      <label for="department" class="block mb-2 font-medium text-gray-700">部署:</label>
      <select
        id="department"
        v-model="form.department"
        data-testid="department-select"
        class="w-full px-3 py-3 border border-gray-300 rounded text-base transition-colors duration-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
      >
        <option value="">選択してください</option>
        <option value="engineering">エンジニアリング</option>
        <option value="design">デザイン</option>
        <option value="marketing">マーケティング</option>
        <option value="sales">営業</option>
        <option value="hr">人事</option>
      </select>
    </div>

    <div class="flex gap-4 mt-8">
      <button
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        data-testid="submit-btn"
        class="flex-1 px-4 py-3 border-none rounded text-base font-medium cursor-pointer transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting">送信中...</span>
        <span v-else>送信</span>
      </button>

      <button
        type="button"
        data-testid="reset-btn"
        class="flex-1 px-4 py-3 border-none rounded text-base font-medium cursor-pointer transition-all duration-200 bg-gray-600 text-white hover:bg-gray-700"
        @click="resetForm"
      >
        リセット
      </button>
    </div>

    <div
      v-if="submitSuccess"
      class="mt-4 px-3 py-3 bg-green-100 border border-green-300 rounded text-green-800 text-center"
      data-testid="success-message"
    >
      ユーザー情報が正常に送信されました！
    </div>
  </form>
</template>

<script setup lang="ts">
interface UserForm {
  name: string;
  email: string;
  age: number | null;
  department: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
}

interface TouchedFields {
  name: boolean;
  email: boolean;
  age: boolean;
}

// Emits
const emit = defineEmits<{
  submit: [userData: UserForm];
}>();

// Reactive data
const form = ref<UserForm>({
  name: "",
  email: "",
  age: null,
  department: "",
});

const errors = ref<FormErrors>({});
const touched = ref<TouchedFields>({
  name: false,
  email: false,
  age: false,
});
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// Computed
const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== "" &&
    form.value.email.trim() !== "" &&
    Object.keys(errors.value).length === 0
  );
});

// Validation functions
const validateName = () => {
  // フィールドがタッチされたらタッチ状態を記録
  if (form.value.name !== "" || touched.value.name) {
    touched.value.name = true;
  }

  if (!form.value.name.trim()) {
    // タッチされていない初期状態の場合はエラーを表示しない
    if (!touched.value.name) {
      delete errors.value.name;
    } else {
      errors.value.name = "名前は必須です";
    }
  } else if (form.value.name.length < 2) {
    touched.value.name = true;
    errors.value.name = "名前は2文字以上で入力してください";
  } else {
    touched.value.name = true;
    delete errors.value.name;
  }
};

const validateEmail = () => {
  // フィールドがタッチされたらタッチ状態を記録
  if (form.value.email !== "" || touched.value.email) {
    touched.value.email = true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    // タッチされていない初期状態の場合はエラーを表示しない
    if (!touched.value.email) {
      delete errors.value.email;
    } else {
      errors.value.email = "メールアドレスは必須です";
    }
  } else if (!emailRegex.test(form.value.email)) {
    touched.value.email = true;
    errors.value.email = "有効なメールアドレスを入力してください";
  } else {
    touched.value.email = true;
    delete errors.value.email;
  }
};

const validateAge = () => {
  if (form.value.age !== null) {
    touched.value.age = true;
    if (form.value.age < 0 || form.value.age > 120) {
      errors.value.age = "年齢は0歳から120歳の間で入力してください";
    } else {
      delete errors.value.age;
    }
  }
};

// Watchers
watch(() => form.value.name, validateName);
watch(() => form.value.email, validateEmail);
watch(() => form.value.age, validateAge);

// Methods
const handleSubmit = async () => {
  validateName();
  validateEmail();
  validateAge();

  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitSuccess.value = false;

  try {
    // シミュレートされた送信処理
    await new Promise((resolve) => setTimeout(resolve, 1000));

    emit("submit", { ...form.value });
    submitSuccess.value = true;

    // 3秒後に成功メッセージを非表示
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("送信エラー:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  // エラーを先にクリアしてからフォームをリセット
  errors.value = {};
  touched.value = {
    name: false,
    email: false,
    age: false,
  };
  form.value = {
    name: "",
    email: "",
    age: null,
    department: "",
  };
  submitSuccess.value = false;
};
</script>

<style scoped>
/* Tailwind CSSを使用しているため、カスタムスタイルは不要 */
</style>
