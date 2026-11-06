export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { token, initToken } = useAuth();
    initToken();

    const isAuthenticated = !!token.value;

    if (!isAuthenticated && to.path !== '/' && to.path !== '/register') {
      return navigateTo('/');
    }

    if (isAuthenticated && to.path === '/') {
      return navigateTo('/dashboard');
    }
  }
});
