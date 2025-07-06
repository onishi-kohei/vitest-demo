// Vitestのブラウザモード専用グローバルセットアップファイル
import { vi, beforeAll, afterAll, beforeEach, afterEach, expect } from "vitest";
// Vue 3のComposition API関数をグローバルに利用可能にする
import { ref, computed, reactive, watch, readonly, nextTick } from "vue";

// ブラウザ環境のグローバルオブジェクト取得
const getGlobalObject = () => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  if (typeof self !== "undefined") return self;
  throw new Error("Unable to locate global object");
};

const globalObj = getGlobalObject();

// Nuxt関数のモック
const useSeoMetaMock = vi.fn();
const useRuntimeConfigMock = vi.fn(() => ({}));
const useNuxtAppMock = vi.fn(() => ({
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
}));
const useRouteMock = vi.fn(() => ({
  path: "/",
  name: "index",
  params: {},
  query: {},
  meta: {},
}));
const useHeadMock = vi.fn();
const navigateToMock = vi.fn();

// Nuxt関数をグローバルに設定
Object.assign(globalObj, {
  useSeoMeta: useSeoMetaMock,
  useRuntimeConfig: useRuntimeConfigMock,
  useNuxtApp: useNuxtAppMock,
  useRoute: useRouteMock,
  useHead: useHeadMock,
  navigateTo: navigateToMock,
});

// Vue関数をグローバルに設定
Object.assign(globalObj, {
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

// ブラウザ環境専用のグローバルモック設定
if (typeof window !== "undefined") {
  // ResizeObserver のモック
  if (!globalObj.ResizeObserver) {
    globalObj.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  }

  // IntersectionObserver のモック
  if (!globalObj.IntersectionObserver) {
    globalObj.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  }

  // matchMedia のモック（レスポンシブテスト用）
  const matchMediaMock = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  }

  // scrollTo のモック
  const scrollToMock = vi.fn();
  if (!window.scrollTo) {
    Object.defineProperty(window, "scrollTo", {
      writable: true,
      value: scrollToMock,
    });
  }

  // localStorage のモック
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  if (!window.localStorage) {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  }

  if (!window.sessionStorage) {
    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
    });
  }
} else {
  // Node.js/サーバー環境でのフォールバック
  globalObj.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  globalObj.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  const matchMediaMock = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  Object.defineProperty(globalObj, "matchMedia", {
    writable: true,
    value: matchMediaMock,
  });

  const scrollToMock = vi.fn();
  Object.defineProperty(globalObj, "scrollTo", {
    writable: true,
    value: scrollToMock,
  });

  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  Object.defineProperty(globalObj, "localStorage", {
    value: localStorageMock,
  });

  Object.defineProperty(globalObj, "sessionStorage", {
    value: sessionStorageMock,
  });
}

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
  const localStorage = globalObj.localStorage || window?.localStorage;
  const sessionStorage = globalObj.sessionStorage || window?.sessionStorage;

  if (localStorage?.clear) localStorage.clear();
  if (sessionStorage?.clear) sessionStorage.clear();

  // Nuxtモックをリセット
  useSeoMetaMock.mockClear();
  useRuntimeConfigMock.mockClear();
  useNuxtAppMock.mockClear();
  useRouteMock.mockClear();
  useHeadMock.mockClear();
  navigateToMock.mockClear();
});

afterEach(() => {
  // DOMをクリーンアップ（ブラウザ環境の場合のみ）
  if (typeof document !== "undefined" && document.body) {
    document.body.innerHTML = "";
  }

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
    // ブラウザ環境でのみdocumentを使用
    if (typeof document !== "undefined") {
      const element = document.querySelector(selector);
      if (element) return element;
    }
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
console.log("✅ Vitest browser setup completed");
