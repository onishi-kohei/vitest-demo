<template>
  <div class="home-page">
    <header class="header">
      <h1 data-testid="page-title">Vitest ブラウザモード デモ</h1>
      <p data-testid="page-description">
        Nuxt 3 + Vitest ブラウザモードによるリグレッションテスト環境
      </p>
    </header>

    <main class="main-content">
      <section class="demo-section">
        <h2>コンポーネントデモ</h2>

        <!-- カウンターコンポーネント -->
        <div class="component-demo">
          <h3>カウンターコンポーネント</h3>
          <Counter />
        </div>

        <!-- ユーザーフォームコンポーネント -->
        <div class="component-demo">
          <h3>ユーザーフォーム</h3>
          <UserForm @submit="handleUserSubmit" />
        </div>

        <!-- タスクリストコンポーネント -->
        <div class="component-demo">
          <h3>タスクリスト</h3>
          <TaskList />
        </div>
      </section>

      <section class="info-section">
        <h2>テスト環境について</h2>
        <ul>
          <li>ユニットテスト: Vue Test Utils + Vitest</li>
          <li>インテグレーションテスト: @nuxt/test-utils + Vitest</li>
          <li>ブラウザテスト: Vitest Browser Mode + Playwright</li>
          <li>ビジュアルリグレッション: スナップショットテスト</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
interface UserFormData {
  name: string
  email: string
  age: number | null
  department: string
}

const handleUserSubmit = (userData: UserFormData) => {
  // 開発環境でのみログ出力
  if (import.meta.dev) {
    // eslint-disable-next-line no-console
    console.log('ユーザーデータが送信されました:', userData)
  }
  // ここで実際のAPI呼び出しやデータ処理を行う
}

// SEO設定
useSeoMeta({
  title: 'Vitest Browser Mode Demo',
  description: 'Nuxt 3とVitestブラウザモードを使ったリグレッションテスト環境のデモ',
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: #2563eb;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.header p {
  color: #6b7280;
  font-size: 1.1rem;
}

.main-content {
  display: grid;
  gap: 3rem;
}

.demo-section h2,
.info-section h2 {
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.component-demo {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.component-demo h3 {
  color: #374151;
  margin-bottom: 1rem;
}

.info-section ul {
  list-style-type: none;
  padding: 0;
}

.info-section li {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  color: #1e40af;
}

.info-section li::before {
  content: "✓ ";
  color: #059669;
  font-weight: bold;
}
</style>
