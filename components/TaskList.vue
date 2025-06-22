<template>
  <div class="task-list" data-testid="task-list">
    <div class="task-header">
      <h3>タスクリスト</h3>
      <div class="task-stats">
        <span data-testid="total-tasks">全 {{ tasks.length }} 件</span>
        <span data-testid="completed-tasks">完了 {{ completedCount }} 件</span>
      </div>
    </div>

    <div class="task-input">
      <input
        v-model="newTaskTitle"
        type="text"
        placeholder="新しいタスクを入力..."
        data-testid="new-task-input"
        class="task-input-field"
        @keyup.enter="addTask"
      >
      <button
        :disabled="!newTaskTitle.trim()"
        data-testid="add-task-btn"
        class="btn btn-primary"
        @click="addTask"
      >
        追加
      </button>
    </div>

    <div class="task-filters">
      <button
        v-for="filter in filters"
        :key="filter.value"
        :class="['filter-btn', { active: currentFilter === filter.value }]"
        :data-testid="`filter-${filter.value}`"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="tasks-container">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        :class="['task-item', { completed: task.completed }]"
        :data-testid="`task-${task.id}`"
      >
        <input
          :id="`task-${task.id}`"
          v-model="task.completed"
          type="checkbox"
          :data-testid="`task-checkbox-${task.id}`"
          class="task-checkbox"
        >
        <label
          :for="`task-${task.id}`"
          class="task-label"
          :data-testid="`task-label-${task.id}`"
        >
          {{ task.title }}
        </label>
        <span class="task-date" :data-testid="`task-date-${task.id}`">
          {{ formatDate(task.createdAt) }}
        </span>
        <button
          :data-testid="`remove-task-${task.id}`"
          class="btn btn-danger btn-sm"
          @click="removeTask(task.id)"
        >
          削除
        </button>
      </div>
    </div>

    <div
      v-if="filteredTasks.length === 0"
      class="empty-state"
      data-testid="empty-state"
    >
      <p v-if="currentFilter === 'all'">
        タスクがありません。新しいタスクを追加してください。
      </p>
      <p v-else-if="currentFilter === 'active'">未完了のタスクはありません。</p>
      <p v-else>完了したタスクはありません。</p>
    </div>

    <div v-if="tasks.length > 0" class="task-actions">
      <button
        :data-testid="allCompleted ? 'uncheck-all-btn' : 'check-all-btn'"
        class="btn btn-secondary"
        @click="toggleAllTasks"
      >
        {{ allCompleted ? "すべて未完了にする" : "すべて完了にする" }}
      </button>
      <button
        :disabled="completedCount === 0"
        data-testid="clear-completed-btn"
        class="btn btn-warning"
        @click="clearCompleted"
      >
        完了済みを削除 ({{ completedCount }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = "all" | "active" | "completed";

// Reactive data
const tasks = ref<Task[]>([
  {
    id: "1",
    title: "Vitestのブラウザモードをセットアップ",
    completed: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "ユニットテストを作成",
    completed: false,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "インテグレーションテストを実装",
    completed: false,
    createdAt: new Date("2024-01-03"),
  },
]);

const newTaskTitle = ref("");
const currentFilter = ref<FilterType>("all");

const filters = [
  { value: "all" as FilterType, label: "すべて" },
  { value: "active" as FilterType, label: "未完了" },
  { value: "completed" as FilterType, label: "完了済み" },
];

// Computed
const completedCount = computed(
  () => tasks.value.filter((task) => task.completed).length
);

const allCompleted = computed(
  () => tasks.value.length > 0 && tasks.value.every((task) => task.completed)
);

const filteredTasks = computed(() => {
  switch (currentFilter.value) {
    case "active":
      return tasks.value.filter((task) => !task.completed);
    case "completed":
      return tasks.value.filter((task) => task.completed);
    default:
      return tasks.value;
  }
});

// Methods
const addTask = () => {
  const title = newTaskTitle.value.trim();
  if (!title) return;

  const newTask: Task = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date(),
  };

  tasks.value.unshift(newTask);
  newTaskTitle.value = "";
};

const removeTask = (id: string) => {
  const index = tasks.value.findIndex((task) => task.id === id);
  if (index > -1) {
    tasks.value.splice(index, 1);
  }
};

const toggleAllTasks = () => {
  const shouldComplete = !allCompleted.value;
  tasks.value.forEach((task) => {
    task.completed = shouldComplete;
  });
};

const clearCompleted = () => {
  tasks.value = tasks.value.filter((task) => !task.completed);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
  }).format(date);
};

// Provide task management composable for testing
const { addTask: _addTask, removeTask: _removeTask } = useTaskManagement(tasks);

function useTaskManagement(taskList: Ref<Task[]>) {
  return {
    addTask: (title: string) => {
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
        createdAt: new Date(),
      };
      taskList.value.unshift(newTask);
    },
    removeTask: (id: string) => {
      const index = taskList.value.findIndex((task) => task.id === id);
      if (index > -1) {
        taskList.value.splice(index, 1);
      }
    },
  };
}
</script>

<style scoped>
.task-list {
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-header h3 {
  color: #1f2937;
  margin: 0;
}

.task-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.task-input {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.task-input-field {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.task-input-field:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.task-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f3f4f6;
}

.filter-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.tasks-container {
  margin-bottom: 1.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.task-item:hover {
  background: #f9fafb;
}

.task-item.completed {
  opacity: 0.7;
  background: #f3f4f6;
}

.task-checkbox {
  width: 1.125rem;
  height: 1.125rem;
}

.task-label {
  flex: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.task-item.completed .task-label {
  text-decoration: line-through;
  color: #6b7280;
}

.task-date {
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 60px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
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

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn-warning {
  background-color: #d97706;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background-color: #b45309;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.task-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.task-actions .btn {
  flex: 1;
}
</style>
