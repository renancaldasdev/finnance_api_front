<template>
  <AppShell>
    <!-- Header -->
    <header class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <span class="text-sm text-ink-muted font-semibold">{{ dateLabel }}</span>
        <h1 class="text-3xl font-bold text-ink m-0">Olá, {{ user?.name }}</h1>
      </div>
      <div class="flex flex-wrap gap-2.5 items-center">
        <button
          @click="openTransactionModal"
          class="flex items-center gap-2 min-h-11 px-4.5 rounded-[10px] bg-brand text-on-brand font-bold text-sm transition-all hover:bg-brand-strong"
        >
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Nova transação
        </button>
      </div>
    </header>

    <!-- KPI Cards -->
    <section class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
      <div class="bg-sidebar text-white rounded-2xl p-5.5 flex flex-col gap-2.5">
        <span class="text-xs font-semibold text-sidebar-ink">Saldo em contas</span>
        <span class="text-3xl font-bold">{{ formatAmount(balanceTotal) }}</span>
        <span class="text-xs text-sidebar-ink font-semibold"
          >{{ accounts.length }} {{ accounts.length === 1 ? 'conta' : 'contas' }} ativa{{
            accounts.length === 1 ? '' : 's'
          }}</span
        >
      </div>
      <div class="bg-surface-raised border border-line rounded-2xl p-5.5 flex flex-col gap-2.5">
        <span class="text-xs font-semibold text-ink-muted">Receitas do mês</span>
        <span class="text-2xl font-bold text-income">{{ formatAmount(totalIncome) }}</span>
        <span class="text-xs text-ink-muted">{{ incomeCount }} lançamentos</span>
      </div>
      <div class="bg-surface-raised border border-line rounded-2xl p-5.5 flex flex-col gap-2.5">
        <span class="text-xs font-semibold text-ink-muted">Despesas do mês</span>
        <span class="text-2xl font-bold text-expense">{{ formatAmount(totalExpense) }}</span>
        <span class="text-xs text-ink-muted">{{ expenseCount }} lançamentos</span>
      </div>
      <div class="bg-surface-raised border border-line rounded-2xl p-5.5 flex flex-col gap-2.5">
        <span class="text-xs font-semibold text-ink-muted">Em aberto</span>
        <span class="text-2xl font-bold text-warning">{{ formatAmount(totalPending) }}</span>
        <span class="text-xs text-ink-muted">{{ pendingCount }} transações</span>
      </div>
    </section>

    <!-- Transactions -->
    <section class="bg-surface-raised border border-line rounded-2xl p-5.5">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-ink m-0">Transações recentes</h2>
        <NuxtLink to="/transactions" class="text-xs font-bold text-link">Ver todas</NuxtLink>
      </div>

      <div v-if="transactions.length === 0" class="text-center py-8 text-ink-muted">
        Nenhuma transação
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="tx in transactions.slice(0, 5)"
          :key="tx.id"
          class="flex justify-between items-center py-3 border-b border-line last:border-0"
        >
          <div class="flex flex-col gap-1">
            <span class="text-sm font-semibold text-ink">{{ tx.description }}</span>
            <span class="text-xs text-ink-muted">{{ formatDate(tx.date) }}</span>
          </div>
          <span
            :class="['text-sm font-bold', tx.type === 'income' ? 'text-income' : 'text-expense']"
          >
            {{ tx.type === 'income' ? '+' : '−' }} {{ formatAmount(tx.amount) }}
          </span>
        </div>
      </div>
    </section>
  </AppShell>

  <TransactionFormModal
    :is-open="showTransactionModal"
    @close="showTransactionModal = false"
    @saved="handleTransactionSaved"
  />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { user } = useAuth();
const { transactions, fetchTransactions } = useTransactions();
const { accounts, fetchAccounts } = useAccounts();

const showTransactionModal = ref(false);

const dateLabel = computed(() => {
  const now = new Date();
  const day = now.toLocaleDateString('pt-BR', { weekday: 'long' });
  const date = now.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  return `${day}, ${date}`;
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
};

const balanceTotal = computed(() => {
  return accounts.value.reduce((sum, account) => sum + (account.balance || 0), 0);
});

const totalIncome = computed(() => {
  return transactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpense = computed(() => {
  return transactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalPending = computed(() => {
  return transactions.value.filter((t) => !t.is_paid).reduce((sum, t) => sum + t.amount, 0);
});

const incomeCount = computed(() => transactions.value.filter((t) => t.type === 'income').length);
const expenseCount = computed(() => transactions.value.filter((t) => t.type === 'expense').length);
const pendingCount = computed(() => transactions.value.filter((t) => !t.is_paid).length);

const openTransactionModal = () => {
  showTransactionModal.value = true;
};

const handleTransactionSaved = async () => {
  try {
    await fetchTransactions();
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
  }
};

onMounted(async () => {
  await Promise.all([fetchAccounts(), fetchTransactions()]);
});
</script>
