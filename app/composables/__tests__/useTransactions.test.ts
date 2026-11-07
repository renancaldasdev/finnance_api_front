import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTransactions } from '../useTransactions';

// Get mock functions from global setup
let mockGet: any;
let mockPost: any;
let mockPut: any;
let mockDel: any;

describe('useTransactions', () => {
  beforeEach(() => {
    const api = (global as any).useApi();
    mockGet = api.get;
    mockPost = api.post;
    mockPut = api.put;
    mockDel = api.del;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTransactions', () => {
    it('should fetch transactions without params', async () => {
      const mockData = [
        { id: 1, description: 'Coffee', amount: 5.5, date: '2024-11-07' },
        { id: 2, description: 'Lunch', amount: 25.0, date: '2024-11-07' },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const { fetchTransactions, transactions, loading, error } = useTransactions();

      expect(loading.value).toBe(false);
      expect(transactions.value).toEqual([]);

      await fetchTransactions();

      expect(mockGet).toHaveBeenCalledWith('/transactions');
      expect(transactions.value).toEqual(mockData);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('should fetch transactions with query params', async () => {
      const mockData = [{ id: 1, description: 'Coffee', amount: 5.5 }];
      mockGet.mockResolvedValue({ data: mockData });

      const { fetchTransactions, transactions } = useTransactions();
      const params = { month: 11, year: 2024 };

      await fetchTransactions(params);

      expect(mockGet).toHaveBeenCalledWith('/transactions?month=11&year=2024');
      expect(transactions.value).toEqual(mockData);
    });

    it('should handle raw array response (without data wrapper)', async () => {
      const mockData = [{ id: 1, description: 'Coffee' }];
      mockGet.mockResolvedValue(mockData);

      const { fetchTransactions, transactions } = useTransactions();

      await fetchTransactions();

      expect(transactions.value).toEqual(mockData);
    });

    it('should set loading state during fetch', async () => {
      mockGet.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: [] }), 10);
          })
      );

      const { fetchTransactions, loading } = useTransactions();

      const promise = fetchTransactions();
      expect(loading.value).toBe(true);

      await promise;
      expect(loading.value).toBe(false);
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const { fetchTransactions, transactions, error, loading } = useTransactions();

      await fetchTransactions();

      expect(error.value).toBe(errorMessage);
      expect(transactions.value).toEqual([]);
      expect(loading.value).toBe(false);
    });

    it('should clear previous error on successful fetch', async () => {
      mockGet.mockRejectedValueOnce(new Error('First error'));
      mockGet.mockResolvedValueOnce({ data: [{ id: 1 }] });

      const { fetchTransactions, error, transactions } = useTransactions();

      await fetchTransactions();
      expect(error.value).toBe('First error');

      await fetchTransactions();
      expect(error.value).toBeNull();
      expect(transactions.value).toEqual([{ id: 1 }]);
    });
  });

  describe('getTransaction', () => {
    it('should fetch a single transaction by id', async () => {
      const mockTransaction = {
        id: 1,
        description: 'Coffee',
        amount: 5.5,
        date: '2024-11-07',
      };
      mockGet.mockResolvedValue(mockTransaction);

      const { getTransaction } = useTransactions();

      const result = await getTransaction(1);

      expect(mockGet).toHaveBeenCalledWith('/transactions/1');
      expect(result).toEqual(mockTransaction);
    });

    it('should set error on getTransaction failure', async () => {
      const errorMessage = 'Transaction not found';
      mockGet.mockRejectedValue(new Error(errorMessage));

      const { getTransaction, error } = useTransactions();

      await expect(getTransaction(999)).rejects.toThrow(errorMessage);
      expect(error.value).toBe(errorMessage);
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction and add to list', async () => {
      const newTransaction = { description: 'Dinner', amount: 45.0, date: '2024-11-07' };
      const responseData = { id: 5, ...newTransaction };
      mockPost.mockResolvedValue({ data: responseData });

      const { createTransaction, transactions } = useTransactions();

      const result = await createTransaction(newTransaction);

      expect(mockPost).toHaveBeenCalledWith('/transactions', newTransaction);
      expect(result).toEqual({ data: responseData });
      expect(transactions.value).toContain(responseData);
    });

    it('should handle raw response without data wrapper', async () => {
      const newTransaction = { description: 'Coffee', amount: 5.5 };
      const responseData = { id: 1, ...newTransaction };
      mockPost.mockResolvedValue(responseData);

      const { createTransaction, transactions } = useTransactions();

      await createTransaction(newTransaction);

      expect(transactions.value).toContain(responseData);
    });

    it('should set error on createTransaction failure', async () => {
      const errorMessage = 'Validation error';
      mockPost.mockRejectedValue(new Error(errorMessage));

      const { createTransaction, error, transactions } = useTransactions();

      const newTransaction = { description: 'Test', amount: 10 };

      await expect(createTransaction(newTransaction)).rejects.toThrow(errorMessage);
      expect(error.value).toBe(errorMessage);
      expect(transactions.value).toEqual([]);
    });
  });

  describe('updateTransaction', () => {
    it('should update existing transaction in list', async () => {
      const existingTransactions = [
        { id: 1, description: 'Coffee', amount: 5.5 },
        { id: 2, description: 'Lunch', amount: 25.0 },
      ];
      const updatedTransaction = { description: 'Espresso', amount: 6.0 };
      const responseData = { id: 1, ...updatedTransaction };

      mockPut.mockResolvedValue({ data: responseData });

      const { updateTransaction, transactions } = useTransactions();
      transactions.value = existingTransactions;

      const result = await updateTransaction(1, updatedTransaction);

      expect(mockPut).toHaveBeenCalledWith('/transactions/1', updatedTransaction);
      expect(result).toEqual({ data: responseData });
      expect(transactions.value[0]).toEqual(responseData);
      expect(transactions.value.length).toBe(2);
    });

    it('should handle update when transaction not in local list', async () => {
      const updatedTransaction = { description: 'Test', amount: 10 };
      const responseData = { id: 1, ...updatedTransaction };
      mockPut.mockResolvedValue({ data: responseData });

      const { updateTransaction, transactions } = useTransactions();

      await updateTransaction(1, updatedTransaction);

      expect(transactions.value).toEqual([]);
    });

    it('should set error on updateTransaction failure', async () => {
      const errorMessage = 'Transaction not found';
      mockPut.mockRejectedValue(new Error(errorMessage));

      const { updateTransaction, error } = useTransactions();

      const updateData = { description: 'Updated', amount: 20 };

      await expect(updateTransaction(1, updateData)).rejects.toThrow(errorMessage);
      expect(error.value).toBe(errorMessage);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction from list', async () => {
      const existingTransactions = [
        { id: 1, description: 'Coffee', amount: 5.5 },
        { id: 2, description: 'Lunch', amount: 25.0 },
        { id: 3, description: 'Dinner', amount: 45.0 },
      ];
      mockDel.mockResolvedValue({});

      const { deleteTransaction, transactions } = useTransactions();
      transactions.value = existingTransactions;

      await deleteTransaction(2);

      expect(mockDel).toHaveBeenCalledWith('/transactions/2');
      expect(transactions.value).toEqual([
        { id: 1, description: 'Coffee', amount: 5.5 },
        { id: 3, description: 'Dinner', amount: 45.0 },
      ]);
    });

    it('should handle delete when transaction not in list', async () => {
      const existingTransactions = [{ id: 1, description: 'Coffee', amount: 5.5 }];
      mockDel.mockResolvedValue({});

      const { deleteTransaction, transactions } = useTransactions();
      transactions.value = existingTransactions;

      await deleteTransaction(999);

      expect(transactions.value).toEqual(existingTransactions);
    });

    it('should set error on deleteTransaction failure', async () => {
      const errorMessage = 'Permission denied';
      mockDel.mockRejectedValue(new Error(errorMessage));

      const { deleteTransaction, error } = useTransactions();

      await expect(deleteTransaction(1)).rejects.toThrow(errorMessage);
      expect(error.value).toBe(errorMessage);
    });
  });

  describe('reactive state', () => {
    it('should maintain reactive state across operations', async () => {
      mockGet.mockResolvedValue({ data: [{ id: 1, description: 'Initial' }] });
      mockPost.mockResolvedValue({ data: { id: 2, description: 'Created' } });

      const { transactions, fetchTransactions, createTransaction } = useTransactions();

      await fetchTransactions();
      expect(transactions.value.length).toBe(1);

      await createTransaction({ description: 'Created' });
      expect(transactions.value.length).toBe(2);
    });
  });
});
