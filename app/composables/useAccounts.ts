import type { Account, ApiResponse } from '~/types';

export const useAccounts = () => {
  const { get, post, put, del } = useApi();

  const accounts = ref<Account[]>([]);
  const loading = ref(false);

  const fetchAccounts = async () => {
    loading.value = true;
    try {
      const data = (await get('/accounts')) as ApiResponse<Account[]>;
      accounts.value = data.data || (data as unknown as Account[]);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      loading.value = false;
    }
  };

  const createAccount = async (name: string, type: string, balance: number): Promise<Account> => {
    try {
      const res = (await post('/accounts', { name, type, balance })) as ApiResponse<Account>;
      const data = res.data || (res as unknown as Account);
      accounts.value.push(data);
      return data;
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  };

  const updateAccount = async (id: number, name: string, type?: string): Promise<Account> => {
    try {
      const payload: Record<string, string> = { name };
      if (type) payload.type = type;
      const res = (await put(`/accounts/${id}`, payload)) as ApiResponse<Account>;
      const data = res.data || (res as unknown as Account);
      const index = accounts.value.findIndex((a) => a.id === id);
      if (index !== -1) accounts.value[index] = data;
      return data;
    } catch (error) {
      console.error('Failed to update account:', error);
      throw error;
    }
  };

  const deleteAccount = async (id: number) => {
    try {
      await del(`/accounts/${id}`);
      accounts.value = accounts.value.filter((a) => a.id !== id);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  return {
    accounts,
    loading,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};
