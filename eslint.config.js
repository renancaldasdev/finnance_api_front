import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';
import parserVue from 'vue-eslint-parser';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', '.nuxt', '.output', 'dist', '.git', '*.log', 'coverage'],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: parserTypeScript,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Nuxt globals
        definePageMeta: 'readonly',
        defineRouteRules: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        defineNuxtConfig: 'readonly',
        navigateTo: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        useState: 'readonly',
        useRuntimeConfig: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        // Vue globals
        computed: 'readonly',
        ref: 'readonly',
        reactive: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onUpdated: 'readonly',
        defineComponent: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        // Auto-imported composables
        useApi: 'readonly',
        useAuth: 'readonly',
        useTransactions: 'readonly',
        useAccounts: 'readonly',
        useCategories: 'readonly',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      ...js.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Nuxt globals
        definePageMeta: 'readonly',
        defineRouteRules: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        defineNuxtConfig: 'readonly',
        navigateTo: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        useState: 'readonly',
        useRuntimeConfig: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        // Vue globals
        computed: 'readonly',
        ref: 'readonly',
        reactive: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onUpdated: 'readonly',
        defineComponent: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        // Auto-imported composables
        useApi: 'readonly',
        useAuth: 'readonly',
        useTransactions: 'readonly',
        useAccounts: 'readonly',
        useCategories: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: {
      ...js.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
