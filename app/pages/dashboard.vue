<template>
  <AppShell>
    <TransactionFormModal
      :is-open="showTransactionModal"
      :mode="transactionMode"
      :accounts="[]"
      :categories="[]"
      @close="showTransactionModal = false"
      @submit="handleTransactionSubmit"
    />

    <div class="flex flex-col gap-6">
      <h1 class="text-3xl font-bold text-ink m-0">Visão Geral</h1>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        <div class="bg-surface-raised border border-line rounded-lg p-6 flex flex-col gap-4">
          <h2 class="text-lg font-semibold text-ink m-0 mb-4">Ações Rápidas</h2>
          <div class="flex flex-col gap-3">
            <button @click="openTransactionModal('income')" class="p-3 px-4 rounded-md font-medium cursor-pointer font-sans text-white transition-all bg-income hover:bg-brand">
              + Receita
            </button>
            <button @click="openTransactionModal('expense')" class="p-3 px-4 rounded-md font-medium cursor-pointer font-sans text-white transition-all bg-expense hover:bg-danger">
              − Despesa
            </button>
            <button @click="openTransactionModal('transfer')" class="p-3 px-4 rounded-md font-medium cursor-pointer font-sans text-white transition-all bg-brand hover:bg-brand-strong">
              ↔ Transferência
            </button>
          </div>
        </div>

        <div class="card">
          <h2>Resumo</h2>
          <div class="summary">
            <div class="item">
              <span class="label">Total de Receitas:</span>
              <span class="value income">{{ formatAmount(totalIncome) }}</span>
            </div>
            <div class="item">
              <span class="label">Total de Despesas:</span>
              <span class="value expense">{{ formatAmount(totalExpense) }}</span>
            </div>
            <div class="item divider">
              <span class="label">Saldo:</span>
              <span class="value" :class="balance >= 0 ? 'income' : 'expense'">
                {{ formatAmount(balance) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Transações Recentes</h2>

        <div v-if="loading" class="empty">Carregando...</div>

        <div v-else-if="transactions.length === 0" class="empty">
          Nenhuma transação ainda
        </div>

        <div v-else class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ formatDate(transaction.created_at) }}</td>
                <td>{{ transaction.description }}</td>
                <td class="text-right font-semibold" :class="`type-${transaction.type}`">
                  {{ formatAmount(transaction.amount, transaction.type) }}
                </td>
                <td :class="`type-${transaction.type}`">
                  {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
                </td>
                <td>
                  <button
                    @click="deleteTransaction(transaction.id)"
                    :disabled="deletingId === transaction.id"
                    class="btn-delete"
                  >
                    {{ deletingId === transaction.id ? '...' : 'Remover' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { transactions, loading, fetchTransactions, deleteTransaction: deleteTransactionApi } = useTransactions()

const showTransactionModal = ref(false)
const transactionMode = ref<'income' | 'expense' | 'transfer'>('expense')
const deletingId = ref<number | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const formatAmount = (amount: number, type?: string) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  const prefix = type ? (type === 'income' ? '+ ' : '− ') : ''
  return prefix + formatter.format(Math.abs(amount) / 100)
}

const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

const totalExpense = computed(() => {
  return transactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const openTransactionModal = (mode: 'income' | 'expense' | 'transfer') => {
  transactionMode.value = mode
  showTransactionModal.value = true
}

const handleTransactionSubmit = async (data: any) => {
  try {
    // TODO: implement modal transaction submission
    showTransactionModal.value = false
    await fetchTransactions()
  } catch (error) {
    alert('Erro ao criar transação')
  }
}

const deleteTransaction = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover?')) return

  deletingId.value = id
  try {
    await deleteTransactionApi(id)
  } catch (error) {
    alert('Erro ao remover transação')
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>

