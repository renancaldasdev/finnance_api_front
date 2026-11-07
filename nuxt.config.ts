import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: 'localhost',
    port: 3000,
  },
  css: ['~/app.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  routeRules: {
    // SSR disabled for authenticated routes: client-side auth check required before rendering
    '/dashboard/**': { ssr: false },
    '/transactions/**': { ssr: false },
    '/accounts/**': { ssr: false },
    '/categories/**': { ssr: false },
  },
});
