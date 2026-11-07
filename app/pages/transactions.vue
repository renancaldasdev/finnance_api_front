<template>
  <AppShell>
    <div class="transactions-page">
      <h1>Transações</h1>

      <div class="filters">
        <input
          v-model="filterType"
          type="text"
          placeholder="Filtrar por tipo..."
          class="filter-input"
        />
      </div>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="transactions.length === 0" class="empty">Nenhuma transação encontrada</div>

      <div v-else class="table-wrapper">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Conta</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td>{{ formatDate(transaction.created_at) }}</td>
              <td>{{ transaction.description }}</td>
              <td>{{ transaction.category?.name }}</td>
              <td>{{ transaction.account?.name }}</td>
              <td :class="`type-${transaction.type}`">
                {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
              </td>
              <td class="amount" :class="`type-${transaction.type}`">
                {{ formatAmount(transaction.amount, transaction.type) }}
              </td>
              <td>{{ transaction.is_paid ? 'Pago' : 'Em aberto' }}</td>
              <td class="actions">
                <button @click="editTransaction(transaction)" class="btn-edit">Editar</button>
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
  </AppShell>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types';

definePageMeta({
  middleware: 'auth',
});

const {
  transactions,
  loading,
  fetchTransactions,
  deleteTransaction: deleteTransactionApi,
} = useTransactions();

const filterType = ref('');
const deletingId = ref<number | null>(null);

const filteredTransactions = computed(() =>
  transactions.value.filter(
    (t) => filterType.value === '' || t.type.includes(filterType.value.toLowerCase())
  )
);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatAmount = (amount: number, type: string) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const prefix = type === 'income' ? '+ ' : '− ';
  return prefix + formatter.format(Math.abs(amount / 100));
};

const editTransaction = (transaction: Transaction) => {
  console.log('Edit transaction:', transaction);
};

const deleteTransaction = async (id: number) => {
  deletingId.value = id;
  try {
    await deleteTransactionApi(id);
  } finally {
    deletingId.value = null;
  }
};

onMounted(() => {
  fetchTransactions();
});
</script>
