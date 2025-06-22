// Vitestのグローバルセットアップファイル
import { vi, beforeAll, afterAll, beforeEach, afterEach, expect } from "vitest";
// Vue 3のComposition API関数をグローバルに利用可能にする
import { ref, computed, reactive, watch, readonly, nextTick } from "vue";

// Vue関数をグローバルに設定
Object.assign(global, {
  ref,
  computed,
  reactive,
  watch,
  readonly,
  nextTick,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
});

// グローバルモック設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// IntersectionObserver のモック
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// matchMedia のモック（レスポンシブテスト用）
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// scrollTo のモック
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

// localStorage のモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// sessionStorage のモック
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// console のモック（テスト中の不要なログを抑制）
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// 各テストファイルの前後でクリーンアップ
beforeEach(() => {
  // モックをリセット
  vi.clearAllMocks();

  // localStorage と sessionStorage をクリア
  localStorageMock.clear();
  sessionStorageMock.clear();
});

afterEach(() => {
  // DOMをクリーンアップ
  document.body.innerHTML = "";

  // タイマーをクリア
  vi.clearAllTimers();
});

// テスト用ユーティリティ関数
export const createMockUser = () => ({
  name: "テストユーザー",
  email: "test@example.com",
  age: 25,
  department: "engineering",
});

export const createMockTask = (overrides = {}) => ({
  id: Date.now().toString(),
  title: "テストタスク",
  completed: false,
  createdAt: new Date(),
  ...overrides,
});

// ブラウザテスト用の待機ユーティリティ
export const waitForElement = async (selector: string, timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Element ${selector} not found within ${timeout}ms`);
};

// リグレッションテスト用のスナップショット設定
expect.addSnapshotSerializer({
  test: (val) =>
    val &&
    typeof val === "object" &&
    val.constructor &&
    val.constructor.name === "Date",
  print: () => "[Date]", // 日付は変動するためスナップショットでは固定値にする
});

// テスト環境の初期化完了をログ出力
console.log("✅ Vitest setup completed");
