<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div
      role="dialog"
      aria-labelledby="modal-title"
      class="w-[560px] max-w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto bg-surface-raised dark:bg-surface-raised-dark rounded-[20px] p-7 flex flex-col gap-5 shadow-modal"
    >
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 id="modal-title" class="text-[22px] font-manrope font-extrabold leading-7 m-0 text-ink dark:text-ink-dark">
          Nova transação
        </h2>
        <button
          type="button"
          aria-label="Fechar"
          @click="close"
          class="w-11 h-11 rounded-[10px] flex items-center justify-center text-ink-soft dark:text-ink-soft-dark hover:bg-surface dark:hover:bg-surface-dark transition"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>
      </div>

      <!-- Type Selector: Segmented Control -->
      <div
        role="radiogroup"
        aria-label="Tipo de transação"
        class="grid grid-cols-3 gap-1.5 p-1 bg-surface-sunken dark:bg-surface-sunken-dark rounded-[12px]"
      >
        <button
          v-for="t in ['expense', 'income', 'transfer']"
          :key="t"
          type="button"
          role="radio"
          :aria-checked="type === t"
          @click="type = t as TransactionType"
          class="min-h-11 border-0 rounded-[9px] font-manrope font-bold text-sm cursor-pointer transition"
          :class="
            type === t
              ? `bg-surface-raised dark:bg-surface-raised-dark text-expense dark:text-expense-dark shadow-selected`
              : `bg-transparent text-ink-soft dark:text-ink-soft-dark`
          "
        >
          {{ typeLabel[t] }}
        </button>
      </div>

      <!-- Amount Input: R$ + large number -->
      <label class="flex flex-col gap-2">
        <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark"> Valor </span>
        <div
          class="flex items-baseline gap-2 px-3.5 py-2.5 border border-control-border dark:border-control-border-dark rounded-xl bg-surface-raised dark:bg-surface-raised-dark"
        >
          <span
            class="text-[20px] font-manrope font-bold"
            :class="
              type === 'expense' ? 'text-expense dark:text-expense-dark' : 'text-ink-muted dark:text-ink-muted-dark'
            "
          >
            R$
          </span>
          <input
            v-model="amount"
            type="text"
            inputmode="decimal"
            placeholder="0,00"
            class="border-0 outline-none font-manrope text-[32px] font-extrabold leading-10 w-full min-w-0 bg-transparent text-ink dark:text-ink-dark"
            :class="type === 'expense' ? 'text-expense dark:text-expense-dark' : ''"
            @input="formatAmount"
          />
        </div>
      </label>

      <!-- Description -->
      <label class="flex flex-col gap-2">
        <div class="flex items-baseline gap-2">
          <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark"> Descrição </span>
          <span class="text-[12px] font-manrope font-medium text-ink-muted dark:text-ink-muted-dark">
            (opcional, até 255 caracteres)
          </span>
        </div>
        <input
          v-model="description"
          type="text"
          maxlength="255"
          placeholder="Ex.: Supermercado"
          class="min-h-11 px-3.5 py-0 border border-control-border dark:border-control-border-dark rounded-[10px] font-manrope text-[15px] font-medium text-ink dark:text-ink-dark bg-surface-raised dark:bg-surface-raised-dark"
        />
      </label>

      <!-- Loading State -->
      <div v-if="loadingAccounts || loadingCategories" class="p-3 bg-surface dark:bg-surface-dark rounded-[10px]">
        <p class="text-[14px] font-manrope text-ink-muted dark:text-ink-muted-dark">
          {{ loadingAccounts ? 'Carregando contas...' : 'Carregando categorias...' }}
        </p>
      </div>

      <!-- Category & Account Grid -->
      <div class="grid grid-cols-2 gap-3">
        <label class="flex flex-col gap-2">
          <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark">
            {{ type === 'transfer' ? 'Categoria Origem' : 'Categoria' }}
          </span>
          <select
            v-model="category"
            :disabled="loadingCategories || filteredCategories.length === 0"
            class="min-h-11 px-2.5 border border-control-border dark:border-control-border-dark rounded-[10px] font-manrope text-[15px] font-medium text-ink dark:text-ink-dark bg-surface-raised dark:bg-surface-raised-dark disabled:opacity-50"
          >
            <option value="">
              {{
                loadingCategories
                  ? 'Carregando...'
                  : filteredCategories.length === 0
                    ? 'Nenhuma categoria'
                    : 'Selecionar...'
              }}
            </option>
            <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark">
            {{ type === 'transfer' ? 'Conta Origem' : 'Conta' }}
          </span>
          <select
            v-model="account"
            :disabled="loadingAccounts || accounts.length === 0"
            class="min-h-11 px-2.5 border border-control-border dark:border-control-border-dark rounded-[10px] font-manrope text-[15px] font-medium text-ink dark:text-ink-dark bg-surface-raised dark:bg-surface-raised-dark disabled:opacity-50"
          >
            <option value="">
              {{ loadingAccounts ? 'Carregando...' : accounts.length === 0 ? 'Nenhuma conta' : 'Selecionar...' }}
            </option>
            <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
              {{ acc.name }}
            </option>
          </select>
        </label>
      </div>

      <!-- Transfer Destination -->
      <template v-if="type === 'transfer'">
        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-2">
            <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark">
              Categoria Destino
            </span>
            <select
              v-model="destinationCategory"
              class="min-h-11 px-2.5 border border-control-border dark:border-control-border-dark rounded-[10px] font-manrope text-[15px] font-medium text-ink dark:text-ink-dark bg-surface-raised dark:bg-surface-raised-dark"
            >
              <option value="">Selecionar...</option>
              <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark">
              Conta Destino
            </span>
            <select
              v-model="destinationAccount"
              class="min-h-11 px-2.5 border border-control-border dark:border-control-border-dark rounded-[10px] font-manrope text-[15px] font-medium text-ink dark:text-ink-dark bg-surface-raised dark:bg-surface-raised-dark"
            >
              <option value="">Selecionar...</option>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                {{ acc.name }}
              </option>
            </select>
          </label>
        </div>
      </template>

      <!-- Paid Checkbox -->
      <template v-if="type !== 'transfer'">
        <label
          class="flex items-center gap-3 min-h-11 font-manrope text-[14px] font-semibold text-ink dark:text-ink-dark cursor-pointer"
        >
          <input v-model="isPaid" type="checkbox" class="w-5 h-5 rounded accent-brand dark:accent-brand-dark" />
          Já foi {{ type === 'expense' ? 'pago' : 'recebido' }}
        </label>
      </template>

      <!-- Date -->
      <label class="flex flex-col gap-2">
        <span class="text-[13px] font-manrope font-bold text-ink-soft dark:text-ink-soft-dark"> Data </span>
        <input
          v-model="date"
          type="date"
          class="min-h-11 px-2.5 border border-control-border dark:border-control-border-dark rounded-[10px] font-manrope text-[15px] font-medium text-ink dark:text-ink-dark bg-surface-raised dark:bg-surface-raised-dark"
        />
      </label>

      <!-- Error -->
      <div v-if="error" class="p-3 bg-danger/10 dark:bg-danger-dark/10 rounded-[10px]">
        <p class="text-danger dark:text-danger-dark text-[14px] font-manrope">{{ error }}</p>
      </div>

      <!-- Footer: Cancel + Save -->
      <div class="mt-auto flex gap-2.5 justify-end pt-2">
        <button
          type="button"
          @click="close"
          class="flex items-center min-h-11 px-4.5 border border-control-border dark:border-control-border-dark rounded-[10px] text-ink dark:text-ink-dark font-manrope font-bold text-[14px] hover:bg-surface dark:hover:bg-surface-dark transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="save"
          :disabled="loading"
          class="flex items-center min-h-11 px-5.5 rounded-[10px] bg-brand dark:bg-brand-dark text-on-brand dark:text-on-brand-dark font-manrope font-bold text-[14px] hover:bg-brand-strong dark:hover:bg-brand-strong-dark disabled:opacity-50 transition"
        >
          {{ loading ? 'Salvando...' : 'Salvar transação' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue';

type TransactionType = 'expense' | 'income' | 'transfer';

const props = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const type = ref<TransactionType>('expense');
const amount = ref('');
const description = ref('');
const category = ref('');
const account = ref('');
const destinationCategory = ref('');
const destinationAccount = ref('');
const isPaid = ref(true);
const date = ref(new Date().toISOString().split('T')[0]);
const error = ref('');
const loading = ref(false);

const typeLabel = {
  expense: 'Despesa',
  income: 'Receita',
  transfer: 'Transferência',
};

const { accounts, loading: loadingAccounts, fetchAccounts } = useAccounts();
const { categories, loading: loadingCategories, fetchCategories } = useCategories();
const { createTransaction } = useTransactions();
const { token } = useAuth();

const isOpenRef = toRef(props, 'isOpen');

const filteredCategories = computed(() => {
  const isActive = (c: any) => c.active !== false;
  if (type.value === 'transfer') return categories.value.filter(isActive);
  return categories.value.filter((c) => c.type === type.value && isActive(c));
});

const loadData = async () => {
  if (!token.value) {
    return;
  }
  try {
    await Promise.all([fetchAccounts(), fetchCategories()]);
  } catch (err) {
    console.error('Error loading accounts/categories:', err);
  }
};

watch(isOpenRef, (newVal) => {
  if (newVal) {
    loadData();
  }
});

watch(
  () => token.value,
  (newVal) => {
    if (newVal && isOpenRef.value && accounts.value.length === 0) {
      loadData();
    }
  },
);

const formatAmount = (e: Event) => {
  const input = e.target as HTMLInputElement;
  // Remove tudo que não é número ou vírgula
  let value = input.value.replace(/[^\d,]/g, '');
  // Garante apenas uma vírgula
  const parts = value.split(',');
  if (parts.length > 2) {
    value = parts[0] + ',' + parts.slice(1).join('');
  }
  input.value = value;
};

const getAmount = () => {
  // Converte "1.234,56" ou "1234,56" para número (1234.56)
  const cleaned = amount.value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const validate = () => {
  error.value = '';
  if (!amount.value || getAmount() < 1) {
    error.value = 'Valor mínimo: R$ 1,00';
    return false;
  }
  if (!account.value) {
    error.value = 'Selecione uma conta';
    return false;
  }
  if (type.value !== 'transfer' && !category.value) {
    error.value = 'Selecione uma categoria';
    return false;
  }
  if (type.value === 'transfer') {
    if (!destinationAccount.value) {
      error.value = 'Selecione a conta de destino';
      return false;
    }
    if (!category.value || !destinationCategory.value) {
      error.value = 'Selecione categorias de origem e destino';
      return false;
    }
  }
  return true;
};

const save = async () => {
  if (!validate()) return;

  loading.value = true;
  try {
    const payload =
      type.value === 'transfer'
        ? {
            origin_account_id: Number.parseInt(account.value),
            destination_account_id: Number.parseInt(destinationAccount.value),
            origin_category_id: Number.parseInt(category.value),
            destination_category_id: Number.parseInt(destinationCategory.value),
            amount: getAmount(),
            description: description.value || null,
            date: date.value,
          }
        : {
            account_id: Number.parseInt(account.value),
            category_id: Number.parseInt(category.value),
            type: type.value,
            amount: getAmount(),
            description: description.value || null,
            is_paid: isPaid.value,
            date: date.value,
          };

    await createTransaction(payload);
    emit('saved');
    close();
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  amount.value = '';
  description.value = '';
  category.value = '';
  account.value = '';
  destinationCategory.value = '';
  destinationAccount.value = '';
  isPaid.value = true;
  date.value = new Date().toISOString().split('T')[0];
  error.value = '';
  type.value = 'expense';
  emit('close');
};
</script>
