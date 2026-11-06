export const useAccounts = () => {
  const { get, post, put, del } = useApi()

  const accounts = ref<any[]>([])
  const loading = ref(false)

  const fetchAccounts = async () => {
    loading.value = true
    try {
      const data = await get('/accounts')
      accounts.value = data.data || data
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      loading.value = false
    }
  }

  const createAccount = async (name: string, type: string, balance: number) => {
    try {
      const res = await post('/accounts', { name, type, balance })
      const data = res.data || res
      accounts.value.push(data)
      return data
    } catch (error) {
      console.error('Failed to create account:', error)
      throw error
    }
  }

  const updateAccount = async (id: number, name: string, type?: string) => {
    try {
      const payload: any = { name }
      if (type) payload.type = type
      const res = await put(`/accounts/${id}`, payload)
      const data = res.data || res
      const index = accounts.value.findIndex(a => a.id === id)
      if (index !== -1) accounts.value[index] = data
      return data
    } catch (error) {
      console.error('Failed to update account:', error)
      throw error
    }
  }

  const deleteAccount = async (id: number) => {
    try {
      await del(`/accounts/${id}`)
      accounts.value = accounts.value.filter(a => a.id !== id)
    } catch (error) {
      console.error('Failed to delete account:', error)
      throw error
    }
  }

  return {
    accounts,
    loading,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}
