import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useApi } from '../useApi';

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();

  // Mock global useState
  (global as any).useState = (key: string, initializer?: () => any) => ({
    value: initializer ? initializer() : null,
  });

  // Mock global useRuntimeConfig
  (global as any).useRuntimeConfig = () => ({
    public: {
      apiBase: 'http://localhost:3000',
    },
  });

  // Mock global navigateTo
  (global as any).navigateTo = vi.fn();
});

describe('useApi', () => {
  describe('request', () => {
    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const api = useApi();
      const result = await api.get('/users');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should make POST request with data', async () => {
      const mockData = { id: 1, name: 'New User' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const api = useApi();
      const payload = { name: 'New User', email: 'test@example.com' };
      const result = await api.post('/users', payload);

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
        })
      );
    });

    it('should include auth token in header', async () => {
      const api = useApi();
      api.token.value = 'test_token_123';

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await api.get('/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test_token_123',
          }),
        })
      );
    });

    it('should handle 401 response by clearing token', async () => {
      const api = useApi();
      api.token.value = 'test_token_123';
      localStorage.setItem('auth_token', 'test_token_123');

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(api.get('/protected')).rejects.toThrow('API error: 401');

      expect(api.token.value).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect((global as any).navigateTo).toHaveBeenCalledWith('/login');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const api = useApi();

      await expect(api.get('/users')).rejects.toThrow('Network error');
    });

    it('should handle 404 errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const api = useApi();

      await expect(api.get('/not-found')).rejects.toThrow('API error: 404');
    });

    it('should handle server errors (5xx)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      const api = useApi();

      await expect(api.post('/users', {})).rejects.toThrow('API error: 500');
    });
  });

  describe('method shortcuts', () => {
    it('should handle PUT requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ updated: true }),
      });

      const api = useApi();
      const result = await api.put('/users/1', { name: 'Updated' });

      expect(result).toEqual({ updated: true });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should handle PATCH requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ patched: true }),
      });

      const api = useApi();
      const result = await api.patch('/users/1', { status: 'active' });

      expect(result).toEqual({ patched: true });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should handle DELETE requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ deleted: true }),
      });

      const api = useApi();
      const result = await api.del('/users/1');

      expect(result).toEqual({ deleted: true });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('content-type headers', () => {
    it('should always set JSON content-type', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const api = useApi();
      await api.post('/test', {});

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        })
      );
    });
  });
});
