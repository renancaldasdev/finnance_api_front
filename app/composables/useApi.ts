import type { RequestOptions } from '~/types';

export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useState<string | null>('auth.token', () => null);

  const request = async (endpoint: string, options: RequestOptions = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }

    const url = `${config.public.apiBase}/api${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        if (response.status === 401) {
          token.value = null;
          localStorage.removeItem('auth_token');
          await navigateTo('/login');
        }
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  const get = (endpoint: string) => request(endpoint, { method: 'GET' });
  const post = (endpoint: string, data: Record<string, unknown>) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(data) });
  const put = (endpoint: string, data: Record<string, unknown>) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  const patch = (endpoint: string, data: Record<string, unknown>) =>
    request(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
  const del = (endpoint: string) => request(endpoint, { method: 'DELETE' });

  return { request, get, post, put, patch, del, token };
};
