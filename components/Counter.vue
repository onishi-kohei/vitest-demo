<template>
  <div class="counter">
    <h2>カウンター</h2>
    <div class="counter-display">
      <span data-testid="counter-value">{{ count }}</span>
    </div>
    <div class="counter-controls">
      <button
        data-testid="increment-btn"
        class="btn btn-primary"
        @click="increment"
      >
        +
      </button>
      <button
        data-testid="decrement-btn"
        class="btn btn-secondary"
        @click="decrement"
      >
        -
      </button>
      <button
        data-testid="reset-btn"
        class="btn btn-danger"
        @click="reset"
      >
        リセット
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}

// リアクティブなプロパティの公開（テスト用）
defineExpose({
  count: readonly(count),
  increment,
  decrement,
  reset
})
</script>

<style scoped>
.counter {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-family: sans-serif;
}

.counter-display {
  font-size: 2rem;
  margin: 20px 0;
  color: #333;
}

.counter-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
