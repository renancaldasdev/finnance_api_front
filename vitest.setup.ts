import { vi } from 'vitest';

// Mock localStorage
const localStorageData: Record<string, string> = {};

global.localStorage = {
  getItem: (key: string) => localStorageData[key] || null,
  setItem: (key: string, value: string) => {
    localStorageData[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageData[key];
  },
  clear: () => {
    Object.keys(localStorageData).forEach((key) => delete localStorageData[key]);
  },
  key: (index: number) => Object.keys(localStorageData)[index] || null,
  length: Object.keys(localStorageData).length,
} as Storage;

// Mock Vue composables
const mockRef = (val: any) => ({
  value: val,
});

const mockComputed = (getter: any) => ({
  value: getter(),
});

global.ref = mockRef;
global.computed = mockComputed;

// Mock Nuxt auto-imports
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDel = vi.fn();

global.useApi = () => ({
  get: mockGet,
  post: mockPost,
  put: mockPut,
  del: mockDel,
  token: { value: null },
});

global.useRouter = () => ({
  push: vi.fn(),
});

global.useState = (key: string, initializer?: () => any) => ({
  value: initializer ? initializer() : null,
});

// Mock other Vue functions
global.watch = vi.fn();
global.watchEffect = vi.fn();
global.onMounted = vi.fn();
global.onUnmounted = vi.fn();
global.reactive = (obj: any) => obj;
