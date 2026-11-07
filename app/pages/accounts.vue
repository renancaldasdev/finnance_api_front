<template>
  <AppShell>
    <div class="flex flex-col mb-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div v-if="accounts.length > 0" class="text-sm text-ink-soft">
            Saldo somado:
            <strong class="text-base text-ink font-bold">{{ formatAmount(totalBalance) }}</strong>
          </div>
          <h1 class="text-4xl font-bold text-ink m-0">Contas</h1>
        </div>
        <button @click="showForm = !showForm" class="fn-btn fn-btn-primary">
          {{ showForm ? 'Cancelar' : '+ Nova Conta' }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <div class="flex-1 basis-96">
        <div
          v-if="errorMessage"
          class="mb-6 bg-warning-soft text-danger p-4 border-l-4 border-danger rounded-md text-sm"
        >
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="py-8 text-center text-ink-muted">Carregando contas...</div>

        <div v-else-if="accounts.length === 0" class="py-8 text-center text-ink-muted">
          Nenhuma conta encontrada. Crie uma para começar.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div
            v-for="account in accounts"
            :key="account.id"
            class="bg-surface-raised border border-line rounded-lg p-6 flex flex-col gap-4"
          >
            <div class="flex gap-4">
              <div
                class="w-12 h-12 shrink-0 flex items-center justify-center rounded-md bg-brand-soft text-brand font-bold text-sm"
              >
                {{ getInitials(account.name) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-bold text-ink m-0 truncate">{{ account.name }}</h3>
                <span :class="['fn-badge', getAccountTypeBadgeClass(account.type)]">{{
                  getAccountType(account.type)
                }}</span>
              </div>
            </div>

            <div class="border-t border-b border-line py-4">
              <span class="block text-xs font-bold text-ink-muted uppercase tracking-tight mb-1"
                >Saldo</span
              >
              <span class="block text-2xl font-extrabold text-ink tabular-nums">{{
                formatAmount(account.balance)
              }}</span>
            </div>

            <div class="flex gap-2">
              <button
                class="flex-1 border rounded-md bg-surface border-transparent cursor-pointer text-brand font-bold p-2"
              >
                Ver extrato
              </button>
              <div class="flex gap-2">
                <button
                  @click="editAccount(account)"
                  class="border p-1 rounded w-10 border-line cursor-pointer"
                  title="Editar"
                  aria-label="Editar conta"
                >
                  ✎
                </button>
                <button
                  @click="deleteAccount(account.id)"
                  :disabled="deletingId === account.id"
                  class="border p-1 rounded w-10 border-line text-red-500 font-bold cursor-pointer"
                  title="Remover"
                  aria-label="Remover conta"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside v-if="showForm" class="w-96 shrink-0">
        <div class="bg-surface-raised border border-line rounded-lg p-6 sticky top-8">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold text-ink m-0">
              {{ formData.id ? 'Editar Conta' : 'Nova conta' }}
            </h2>
            <button
              @click="closeForm"
              class="fn-btn-icon"
              title="Fechar"
              aria-label="Fechar formulário"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="handleCreateAccount" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label for="name" class="text-xs font-bold text-ink-muted uppercase tracking-tight"
                >Nome</label
              >
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Ex.: Inter"
                class="px-4 py-3 border border-control-border rounded-md text-sm text-ink bg-surface-raised focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft placeholder-ink-muted h-10"
                required
                minlength="3"
                maxlength="255"
              />
            </div>

            <div class="flex flex-col gap-3">
              <p class="text-xs font-bold text-ink-muted uppercase tracking-tight">Tipo</p>
              <div class="flex flex-col gap-3">
                <label
                  class="flex items-center gap-3 cursor-pointer text-sm text-ink-soft hover:text-ink"
                >
                  <input
                    v-model="formData.type"
                    type="radio"
                    value="checking"
                    required
                    class="accent-brand"
                  />
                  <span class="select-none">Conta corrente</span>
                </label>
                <label
                  class="flex items-center gap-3 cursor-pointer text-sm text-ink-soft hover:text-ink"
                >
                  <input
                    v-model="formData.type"
                    type="radio"
                    value="saving"
                    required
                    class="accent-brand"
                  />
                  <span class="select-none">Poupança</span>
                </label>
                <label
                  class="flex items-center gap-3 cursor-pointer text-sm text-ink-soft hover:text-ink"
                >
                  <input
                    v-model="formData.type"
                    type="radio"
                    value="investment"
                    required
                    class="accent-brand"
                  />
                  <span class="select-none">Investimento</span>
                </label>
              </div>
            </div>

            <div v-if="!formData.id" class="flex flex-col gap-2">
              <label for="balance" class="text-xs font-bold text-ink-muted uppercase tracking-tight"
                >Saldo inicial</label
              >
              <div class="relative flex items-center">
                <span
                  class="absolute left-4 text-sm text-ink-muted font-semibold pointer-events-none"
                  >R$</span
                >
                <input
                  id="balance"
                  v-model.number="formData.balance"
                  type="number"
                  placeholder="0,00"
                  class="w-full pl-10 pr-4 py-3 border border-control-border rounded-md text-sm text-ink bg-surface-raised focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft placeholder-ink-muted h-10"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="creatingAccount"
              class="px-6 py-3 bg-brand text-on-brand rounded-md text-sm font-bold cursor-pointer hover:bg-brand-strong transition disabled:opacity-60 disabled:cursor-not-allowed h-10 flex items-center justify-center mt-3"
            >
              {{
                creatingAccount
                  ? formData.id
                    ? 'Salvando...'
                    : 'Criando...'
                  : formData.id
                    ? 'Salvar'
                    : 'Criar conta'
              }}
            </button>
          </form>
        </div>
      </aside>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-surface-raised border border-line rounded-lg p-6 max-w-sm mx-4 shadow-modal">
        <h3 class="text-lg font-bold text-ink m-0 mb-4">Remover Conta?</h3>
        <p class="text-sm text-ink-soft mb-6">
          Tem certeza que deseja remover esta conta? Esta ação não pode ser desfeita.
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="cancelDelete" class="fn-btn">Cancelar</button>
          <button @click="confirmDelete" class="fn-btn fn-btn-danger">Remover</button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import type { Account } from '~/types';
import { getErrorMessage } from '~/types';

definePageMeta({
  middleware: 'auth',
});

const {
  accounts,
  loading,
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount: deleteAccountApi,
} = useAccounts();

const creatingAccount = ref(false);
const deletingId = ref<number | null>(null);
const errorMessage = ref('');
const showForm = ref(false);
const showDeleteModal = ref(false);
const deleteAccountId = ref<number | null>(null);

const formData = reactive({
  id: null as number | null,
  name: '',
  type: '',
  balance: 0,
});

const getAccountType = (type: string) => {
  const types: Record<string, string> = {
    checking: 'Conta corrente',
    saving: 'Poupança',
    investment: 'Investimento',
  };
  return types[type] || type;
};

const getAccountTypeBadgeClass = (type: string) => {
  const badgeClasses: Record<string, string> = {
    checking: 'fn-badge-success',
    saving: 'fn-badge-warning',
    investment: 'fn-badge',
  };
  return badgeClasses[type] || 'fn-badge';
};

const formatAmount = (amount: number) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formatter.format(amount);
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const totalBalance = computed(() => {
  return accounts.value.reduce((sum, acc) => sum + (acc.balance || 0), 0);
});

const handleCreateAccount = async () => {
  errorMessage.value = '';
  creatingAccount.value = true;
  try {
    if (formData.id) {
      await updateAccount(formData.id, formData.name, formData.type);
    } else {
      await createAccount(formData.name, formData.type, formData.balance);
    }
    formData.name = '';
    formData.type = '';
    formData.balance = 0;
    formData.id = null;
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    creatingAccount.value = false;
  }
};

const closeForm = () => {
  showForm.value = false;
  formData.id = null;
  formData.name = '';
  formData.type = '';
  formData.balance = 0;
  errorMessage.value = '';
};

const editAccount = (account: Account) => {
  errorMessage.value = '';
  formData.id = account.id;
  formData.name = account.name;
  formData.type = account.type;
  formData.balance = account.balance;
  window.scrollTo(0, 0);
};

const deleteAccount = (id: number) => {
  deleteAccountId.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!deleteAccountId.value) return;
  deletingId.value = deleteAccountId.value;
  try {
    await deleteAccountApi(deleteAccountId.value);
    errorMessage.value = '';
    showDeleteModal.value = false;
    deleteAccountId.value = null;
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    deletingId.value = null;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  deleteAccountId.value = null;
};

onMounted(() => {
  fetchAccounts();
});
</script>
