<template>
  <div class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-sm" data-testid="task-list">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-gray-800 text-xl font-semibold m-0">タスクリスト</h3>
      <div class="flex gap-4 text-sm text-gray-500">
        <span data-testid="total-tasks">全 {{ tasks.length }} 件</span>
        <span data-testid="completed-tasks">完了 {{ completedCount }} 件</span>
      </div>
    </div>

    <div class="flex gap-3 mb-6">
      <input
        v-model="newTaskTitle"
        type="text"
        placeholder="新しいタスクを入力..."
        data-testid="new-task-input"
        class="flex-1 px-3 py-3 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        @keyup.enter="addTask"
      >
      <button
        :disabled="!newTaskTitle.trim()"
        data-testid="add-task-btn"
        class="px-4 py-2 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        @click="addTask"
      >
        追加
      </button>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        v-for="filter in filters"
        :key="filter.value"
        :class="[
          'px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all duration-200 hover:bg-gray-200',
          currentFilter === filter.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white'
        ]"
        :data-testid="`filter-${filter.value}`"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="mb-6">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        :class="[
          'flex items-center gap-3 p-3 border border-gray-200 rounded mb-2 transition-all duration-200 hover:bg-gray-200',
          { 'opacity-70 bg-gray-50': task.completed }
        ]"
        :data-testid="`task-${task.id}`"
      >
        <input
          :id="`task-${task.id}`"
          v-model="task.completed"
          type="checkbox"
          :data-testid="`task-checkbox-${task.id}`"
          class="w-4.5 h-4.5"
        >
        <label
          :for="`task-${task.id}`"
          :class="[
            'flex-1 cursor-pointer transition-all duration-200',
            { 'line-through text-gray-500': task.completed }
          ]"
          :data-testid="`task-label-${task.id}`"
        >
          {{ task.title }}
        </label>
        <span class="text-sm text-gray-500 min-w-15" :data-testid="`task-date-${task.id}`">
          {{ formatDate(task.createdAt) }}
        </span>
        <button
          :data-testid="`remove-task-${task.id}`"
          class="px-3 py-1.5 border-none rounded text-xs font-medium cursor-pointer transition-all duration-200 bg-red-600 text-white hover:bg-red-700"
          @click="removeTask(task.id)"
        >
          削除
        </button>
      </div>
    </div>

    <div
      v-if="filteredTasks.length === 0"
      class="text-center py-8 text-gray-500"
      data-testid="empty-state"
    >
      <p v-if="currentFilter === 'all'">
        タスクがありません。新しいタスクを追加してください。
      </p>
      <p v-else-if="currentFilter === 'active'">未完了のタスクはありません。</p>
      <p v-else>完了したタスクはありません。</p>
    </div>

    <div v-if="tasks.length > 0" class="flex gap-4 pt-4 border-t border-gray-200">
      <button
        :data-testid="allCompleted ? 'uncheck-all-btn' : 'check-all-btn'"
        class="flex-1 px-4 py-2 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
        @click="toggleAllTasks"
      >
        {{ allCompleted ? "すべて未完了にする" : "すべて完了にする" }}
      </button>
      <button
        :disabled="completedCount === 0"
        data-testid="clear-completed-btn"
        class="flex-1 px-4 py-2 border-none rounded text-sm font-medium cursor-pointer transition-all duration-200 bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
/* Tailwind CSSを使用しているため、カスタムスタイルは不要 */
</style>
