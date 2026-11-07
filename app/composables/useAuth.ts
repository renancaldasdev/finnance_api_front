import type { User } from '~/types';

// Storage keys (centralized for easy maintenance)
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    // Private browsing mode: fall back to sessionStorage
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }
};

const setStorageItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage unavailable:', error);
    }
  }
};

const removeStorageItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Storage not available
    }
  }
};

export const useAuth = () => {
  const { post, get, token } = useApi();
  const router = useRouter();

  const user = useState<User | null>('auth.user', () => null);
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const initToken = () => {
    const stored = getStorageItem(AUTH_TOKEN_KEY);
    if (stored) {
      token.value = stored;
    }

    const storedUser = getStorageItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Erro ao restaurar usuário:', error);
        removeStorageItem(AUTH_USER_KEY);
      }
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await post('/login', { email, password });
      // Handle both wrapped (data) and unwrapped response formats
      const data: User = (res as any).data || res;
      token.value = data.token || '';
      user.value = data;
      setStorageItem(AUTH_TOKEN_KEY, data.token || '');
      setStorageItem(AUTH_USER_KEY, JSON.stringify(data));
      // Navigation handled by router, don't await to avoid blocking
      router.push('/dashboard');
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
      const res = await post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      // Handle both wrapped (data) and unwrapped response formats
      const data: User = (res as any).data || res;
      token.value = data.token || '';
      user.value = data;
      setStorageItem(AUTH_TOKEN_KEY, data.token || '');
      setStorageItem(AUTH_USER_KEY, JSON.stringify(data));
      // Navigation handled by router, don't await to avoid blocking
      router.push('/dashboard');
      return data;
    } catch (error) {
      throw new Error('Registration failed', { cause: error });
    }
  };

  const logout = async () => {
    // Retry logout once if it fails (server might be temporarily unavailable)
    let retries = 0;
    const maxRetries = 1;
    while (retries <= maxRetries) {
      try {
        const { post } = useApi();
        await post('/logout', {});
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          console.error('Logout failed after retries:', error);
          break;
        }
        // Wait before retrying
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    // Always clear local state, even if server logout fails
    token.value = null;
    user.value = null;
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(AUTH_USER_KEY);
    // Navigation handled by router
    router.push('/');
  };

  const getMe = async (): Promise<User> => {
    try {
      const res = await get('/me');
      // Handle both wrapped (data) and unwrapped response formats
      const data: User = (res as any).data || res;
      user.value = data;
      return data;
    } catch (error) {
      token.value = null;
      removeStorageItem(AUTH_TOKEN_KEY);
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
