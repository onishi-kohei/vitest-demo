<template>
  <div class="max-w-6xl mx-auto p-8">
    <header class="text-center mb-12">
      <h1 data-testid="page-title" class="text-blue-600 text-4xl mb-4 font-bold">Vitest ブラウザモード デモ</h1>
      <p data-testid="page-description" class="text-gray-500 text-lg">
        Nuxt 3 + Vitest ブラウザモードによるリグレッションテスト環境
      </p>
    </header>

    <main class="grid gap-12">
      <section>
        <h2 class="text-gray-800 border-b-2 border-gray-200 pb-2 mb-8 text-2xl font-semibold">コンポーネントデモ</h2>

        <!-- カウンターコンポーネント -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h3 class="text-gray-700 mb-4 text-xl font-medium">カウンターコンポーネント</h3>
          <Counter />
        </div>

        <!-- ユーザーフォームコンポーネント -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h3 class="text-gray-700 mb-4 text-xl font-medium">ユーザーフォーム</h3>
          <UserForm @submit="handleUserSubmit" />
        </div>

        <!-- タスクリストコンポーネント -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h3 class="text-gray-700 mb-4 text-xl font-medium">タスクリスト</h3>
          <TaskList />
        </div>
      </section>

      <section>
        <h2 class="text-gray-800 border-b-2 border-gray-200 pb-2 mb-8 text-2xl font-semibold">テスト環境について</h2>
        <ul class="list-none p-0">
          <li class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-2 text-blue-800 before:content-['✓_'] before:text-green-600 before:font-bold">ユニットテスト: Vue Test Utils + Vitest</li>
          <li class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-2 text-blue-800 before:content-['✓_'] before:text-green-600 before:font-bold">インテグレーションテスト: @nuxt/test-utils + Vitest</li>
          <li class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-2 text-blue-800 before:content-['✓_'] before:text-green-600 before:font-bold">ブラウザテスト: Vitest Browser Mode + Playwright</li>
          <li class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-2 text-blue-800 before:content-['✓_'] before:text-green-600 before:font-bold">ビジュアルリグレッション: スナップショットテスト</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
interface UserFormData {
  name: string;
  email: string;
  age: number | null;
  department: string;
}

const handleUserSubmit = (userData: UserFormData) => {
  // 開発環境でのみログ出力
  if (import.meta.dev) {
    // eslint-disable-next-line no-console
    console.log("ユーザーデータが送信されました:", userData);
  }
  // ここで実際のAPI呼び出しやデータ処理を行う
};

// SEO設定
useSeoMeta({
  title: "Vitest Browser Mode Demo",
  description:
    "Nuxt 3とVitestブラウザモードを使ったリグレッションテスト環境のデモ",
});
</script>

<style scoped>
/* Tailwind CSSを使用しているため、カスタムスタイルは不要 */
</style>
