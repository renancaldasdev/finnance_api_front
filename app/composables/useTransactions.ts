export const useTransactions = () => {
  const { get, post, put, patch, del } = useApi()

  const transactions = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTransactions = async (params?: any) => {
    loading.value = true
    error.value = null
    try {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const data = await get(`/transactions${query}`)
      transactions.value = data.data || data
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getTransaction = async (id: number) => {
    try {
      return await get(`/transactions/${id}`)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const createTransaction = async (transaction: any) => {
    try {
      const data = await post('/transactions', transaction)
      transactions.value.push(data.data || data)
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateTransaction = async (id: number, transaction: any) => {
    try {
      const data = await put(`/transactions/${id}`, transaction)
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions.value[index] = data.data || data
      }
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      await del(`/transactions/${id}`)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
  }
}
