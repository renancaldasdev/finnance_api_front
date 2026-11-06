export const useAuth = () => {
  const { post, get, token } = useApi();
  const router = useRouter();

  const user = useState<any>('auth.user', () => null);
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const initToken = () => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      token.value = stored;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await post('/login', { email, password });
      const data = res.data || res;
      token.value = data.token;
      user.value = data;
      localStorage.setItem('auth_token', data.token);
      await router.push('/dashboard');
      return data;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const res = await post('/register', { name, email, password, password_confirmation: passwordConfirmation });
      const data = res.data || res;
      token.value = data.token;
      user.value = data;
      localStorage.setItem('auth_token', data.token);
      await router.push('/dashboard');
      return data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      const { post } = useApi();
      await post('/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('auth_token');
      await router.push('/');
    }
  };

  const getMe = async () => {
    try {
      const res = await get('/me');
      const data = res.data || res;
      user.value = data;
      return data;
    } catch (error) {
      token.value = null;
      localStorage.removeItem('auth_token');
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    getMe,
    initToken,
  };
};
