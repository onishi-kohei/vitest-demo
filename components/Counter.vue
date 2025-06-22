<template>
  <div class="max-w-sm mx-auto p-5 border border-gray-300 rounded-lg text-center font-sans">
    <h2 class="text-xl font-semibold mb-4">カウンター</h2>
    <div class="text-3xl my-5 text-gray-800">
      <span data-testid="counter-value">{{ count }}</span>
    </div>
    <div class="flex gap-2.5 justify-center">
      <button
        data-testid="increment-btn"
        class="px-5 py-2.5 border-none rounded cursor-pointer text-base bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
        @click="increment"
      >
        +
      </button>
      <button
        data-testid="decrement-btn"
        class="px-5 py-2.5 border-none rounded cursor-pointer text-base bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
        @click="decrement"
      >
        -
      </button>
      <button
        data-testid="reset-btn"
        class="px-5 py-2.5 border-none rounded cursor-pointer text-base bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
        @click="reset"
      >
        リセット
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};

const reset = () => {
  count.value = 0;
};

// リアクティブなプロパティの公開（テスト用）
defineExpose({
  count: readonly(count),
  increment,
  decrement,
  reset,
});
</script>

<style scoped>
/* Tailwind CSSを使用しているため、カスタムスタイルは不要 */
</style>
