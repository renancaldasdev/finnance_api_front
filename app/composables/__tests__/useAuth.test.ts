import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth } from '../useAuth';

// Mock useApi and useRouter
const mockPost = vi.fn();
const mockGet = vi.fn();
const mockToken = { value: null as string | null };

const mockRouterPush = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockToken.value = null;
  localStorage.clear();
  sessionStorage.clear();

  // Mock global useApi
  (global as any).useApi = () => ({
    post: mockPost,
    get: mockGet,
    token: mockToken,
  });

  // Mock global useRouter
  (global as any).useRouter = () => ({
    push: mockRouterPush,
  });

  // Mock global useState
  (global as any).useState = (key: string, initializer?: () => any) => ({
    value: initializer ? initializer() : null,
  });

  // Mock global computed - returns computed-like object that recomputes
  (global as any).computed = (getter: () => any) => ({
    get value() {
      return getter();
    },
  });
});

describe('useAuth', () => {
  describe('login', () => {
    it('should login successfully and store token', async () => {
      const auth = useAuth();
      const mockUser = { id: 1, name: 'Test', email: 'test@example.com', token: 'token123' };
      mockPost.mockResolvedValue({ data: mockUser });

      const result = await auth.login('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockPost).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle login error', async () => {
      const auth = useAuth();
      mockPost.mockRejectedValue(new Error('Invalid credentials'));

      await expect(auth.login('test@example.com', 'wrong')).rejects.toThrow('Login failed');
    });

    it('should handle response without data wrapper', async () => {
      const auth = useAuth();
      const mockUser = { id: 1, name: 'Test', email: 'test@example.com', token: 'token123' };
      mockPost.mockResolvedValue(mockUser);

      const result = await auth.login('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const auth = useAuth();
      const mockUser = { id: 2, name: 'New User', email: 'new@example.com', token: 'token456' };
      mockPost.mockResolvedValue({ data: mockUser });

      const result = await auth.register(
        'New User',
        'new@example.com',
        'password123',
        'password123'
      );

      expect(result).toEqual(mockUser);
      expect(mockPost).toHaveBeenCalledWith('/register', {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle register error', async () => {
      const auth = useAuth();
      mockPost.mockRejectedValue(new Error('Email already exists'));

      await expect(
        auth.register('New User', 'test@example.com', 'password123', 'password123')
      ).rejects.toThrow('Registration failed');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const auth = useAuth();
      mockPost.mockResolvedValue({});
      localStorage.setItem('auth_token', 'token123');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Test' }));

      await auth.logout();

      expect(mockPost).toHaveBeenCalledWith('/logout', {});
      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should still clear state even if logout fails', async () => {
      const auth = useAuth();
      mockPost.mockRejectedValue(new Error('Server error'));
      localStorage.setItem('auth_token', 'token123');

      await auth.logout();

      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should retry logout once on failure', async () => {
      const auth = useAuth();
      mockPost.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({});

      await auth.logout();

      expect(mockPost).toHaveBeenCalledTimes(2);
    });
  });

  describe('initToken', () => {
    it('should restore token from localStorage', () => {
      localStorage.setItem('auth_token', 'token123');
      const auth = useAuth();

      auth.initToken();

      expect(auth.token.value).toBe('token123');
    });

    it('should restore user from localStorage', () => {
      const mockUser = { id: 1, name: 'Test', email: 'test@example.com' };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      const auth = useAuth();

      auth.initToken();

      expect(auth.user.value).toEqual(mockUser);
    });

    it('should handle corrupted user data', () => {
      localStorage.setItem('auth_user', 'invalid json');
      const auth = useAuth();

      auth.initToken();

      expect(auth.user.value).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    // Note: sessionStorage fallback is tested in useAuth itself,
    // but complex to mock in vitest. Functional test recommended in E2E.
  });

  describe('getMe', () => {
    it('should fetch current user', async () => {
      const auth = useAuth();
      const mockUser = { id: 1, name: 'Test', email: 'test@example.com' };
      mockGet.mockResolvedValue({ data: mockUser });

      const result = await auth.getMe();

      expect(result).toEqual(mockUser);
      expect(mockGet).toHaveBeenCalledWith('/me');
    });

    it('should clear token on 401', async () => {
      const auth = useAuth();
      mockToken.value = 'old_token';
      mockGet.mockRejectedValue(new Error('Unauthorized'));

      await expect(auth.getMe()).rejects.toThrow('Unauthorized');

      expect(mockToken.value).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should expose isAuthenticated computed property', () => {
      const auth = useAuth();

      expect(auth.isAuthenticated).toBeDefined();
      expect(auth.isAuthenticated.value).toBeDefined();
    });
  });
});
