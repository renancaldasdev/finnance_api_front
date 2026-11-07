import type { Transaction, TransactionPayload, TransactionParams, ApiResponse } from '~/types';
import { getErrorMessage } from '~/types';

export const useTransactions = () => {
  const { get, post, put, del } = useApi();

  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTransactions = async (params?: TransactionParams) => {
    loading.value = true;
    error.value = null;
    try {
      const query = params
        ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}`
        : '';
      const data = (await get(`/transactions${query}`)) as ApiResponse<Transaction[]>;
      transactions.value = data.data || (data as unknown as Transaction[]);
    } catch (err: unknown) {
      error.value = getErrorMessage(err);
    } finally {
      loading.value = false;
    }
  };

  const getTransaction = async (id: number): Promise<Transaction> => {
    try {
      const data = (await get(`/transactions/${id}`)) as ApiResponse<Transaction>;
      return data.data || (data as unknown as Transaction);
    } catch (err: unknown) {
      error.value = getErrorMessage(err);
      throw err;
    }
  };

  const createTransaction = async (transaction: TransactionPayload): Promise<Transaction> => {
    try {
      const data = (await post('/transactions', transaction)) as ApiResponse<Transaction>;
      const created = data.data || (data as unknown as Transaction);
      transactions.value.push(created);
      return created;
    } catch (err: unknown) {
      error.value = getErrorMessage(err);
      throw err;
    }
  };

  const updateTransaction = async (
    id: number,
    transaction: Partial<TransactionPayload>
  ): Promise<Transaction> => {
    try {
      const data = (await put(`/transactions/${id}`, transaction)) as ApiResponse<Transaction>;
      const updated = data.data || (data as unknown as Transaction);
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = updated;
      }
      return updated;
    } catch (err: unknown) {
      error.value = getErrorMessage(err);
      throw err;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await del(`/transactions/${id}`);
      transactions.value = transactions.value.filter((t) => t.id !== id);
    } catch (err: unknown) {
      error.value = getErrorMessage(err);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
