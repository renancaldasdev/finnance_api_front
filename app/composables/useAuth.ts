import type { User, AuthResponse } from '~/types';

export const useAuth = () => {
  const { post, get, token } = useApi();
  const router = useRouter();

  const user = useState<User | null>('auth.user', () => null);
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const initToken = () => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      token.value = stored;
    }

    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Erro ao restaurar usuário:', error);
      }
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = (await post('/login', { email, password })) as AuthResponse;
      const data = res.data || (res as unknown as User);
      token.value = data.token || '';
      user.value = data;
      localStorage.setItem('auth_token', data.token || '');
      localStorage.setItem('auth_user', JSON.stringify(data));
      await router.push('/dashboard');
      return data;
    } catch (error) {
      throw new Error('Login failed', { cause: error });
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<User> => {
    try {
      const res = (await post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })) as AuthResponse;
      const data = res.data || (res as unknown as User);
      token.value = data.token || '';
      user.value = data;
      localStorage.setItem('auth_token', data.token || '');
      localStorage.setItem('auth_user', JSON.stringify(data));
      await router.push('/dashboard');
      return data;
    } catch (error) {
      throw new Error('Registration failed', { cause: error });
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
      localStorage.removeItem('auth_user');
      await router.push('/');
    }
  };

  const getMe = async (): Promise<User> => {
    try {
      const res = (await get('/me')) as AuthResponse;
      const data = res.data || (res as unknown as User);
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
