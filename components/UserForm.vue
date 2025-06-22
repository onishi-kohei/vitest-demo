<template>
  <form
    class="user-form"
    data-testid="user-form"
    @submit.prevent="handleSubmit"
  >
    <h3>ユーザー情報入力</h3>

    <div class="form-group">
      <label for="name">名前:</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        data-testid="name-input"
        required
        class="form-input"
        placeholder="山田太郎"
      >
      <span v-if="errors.name" class="error-message" data-testid="name-error">
        {{ errors.name }}
      </span>
    </div>

    <div class="form-group">
      <label for="email">メールアドレス:</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        data-testid="email-input"
        required
        class="form-input"
        placeholder="example@email.com"
      >
      <span v-if="errors.email" class="error-message" data-testid="email-error">
        {{ errors.email }}
      </span>
    </div>

    <div class="form-group">
      <label for="age">年齢:</label>
      <input
        id="age"
        v-model.number="form.age"
        type="number"
        data-testid="age-input"
        min="0"
        max="120"
        class="form-input"
        placeholder="25"
      >
      <span v-if="errors.age" class="error-message" data-testid="age-error">
        {{ errors.age }}
      </span>
    </div>

    <div class="form-group">
      <label for="department">部署:</label>
      <select
        id="department"
        v-model="form.department"
        data-testid="department-select"
        class="form-input"
      >
        <option value="">選択してください</option>
        <option value="engineering">エンジニアリング</option>
        <option value="design">デザイン</option>
        <option value="marketing">マーケティング</option>
        <option value="sales">営業</option>
        <option value="hr">人事</option>
      </select>
    </div>

    <div class="form-actions">
      <button
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        data-testid="submit-btn"
        class="btn btn-primary"
      >
        <span v-if="isSubmitting">送信中...</span>
        <span v-else>送信</span>
      </button>

      <button
        type="button"
        data-testid="reset-btn"
        class="btn btn-secondary"
        @click="resetForm"
      >
        リセット
      </button>
    </div>

    <div
      v-if="submitSuccess"
      class="success-message"
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
  if (!form.value.name.trim()) {
    errors.value.name = "名前は必須です";
  } else if (form.value.name.length < 2) {
    errors.value.name = "名前は2文字以上で入力してください";
  } else {
    delete errors.value.name;
  }
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    errors.value.email = "メールアドレスは必須です";
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = "有効なメールアドレスを入力してください";
  } else {
    delete errors.value.email;
  }
};

const validateAge = () => {
  if (form.value.age !== null) {
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
  form.value = {
    name: "",
    email: "",
    age: null,
    department: "",
  };
  errors.value = {};
  submitSuccess.value = false;
};
</script>

<style scoped>
.user-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-form h3 {
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 4px;
  color: #065f46;
  text-align: center;
}
</style>
