<template>
  <AppShell>
    <div class="accounts-page">
      <div class="header">
        <h1>Contas</h1>
        <button @click="showForm = !showForm" class="btn-primary">
          {{ showForm ? 'Cancelar' : 'Nova Conta' }}
        </button>
      </div>

      <div v-if="showForm" class="form-card">
        <h2>{{ formData.id ? 'Editar Conta' : 'Nova Conta' }}</h2>
        <form @submit.prevent="handleCreateAccount" class="form">
          <div class="form-group">
            <label>Nome</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Ex: Conta Corrente"
              class="form-input"
              required
              minlength="3"
              maxlength="255"
            />
          </div>

          <div class="form-group">
            <label>Tipo</label>
            <select v-model="formData.type" class="form-input" required :disabled="!!formData.id">
              <option value="">Selecione um tipo</option>
              <option value="checking">Conta Corrente</option>
              <option value="saving">Poupança</option>
              <option value="investment">Investimento</option>
            </select>
          </div>

          <div v-if="!formData.id" class="form-group">
            <label>Saldo Inicial (centavos)</label>
            <input
              v-model.number="formData.balance"
              type="number"
              placeholder="0"
              class="form-input"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="creatingAccount"
            class="btn-primary"
          >
            {{ creatingAccount ? (formData.id ? 'Salvando...' : 'Criando...') : (formData.id ? 'Salvar' : 'Criar Conta') }}
          </button>
        </form>
      </div>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="accounts.length === 0" class="empty">
        Nenhuma conta encontrada
      </div>

      <div v-else class="cards-grid">
        <div v-for="account in accounts" :key="account.id" class="card">
          <div class="card-header">
            <h3>{{ account.name }}</h3>
            <span class="badge">{{ getAccountType(account.type) }}</span>
          </div>
          <div class="card-content">
            <div class="balance">
              <span class="label">Saldo</span>
              <span class="value">
                {{ formatAmount(account.balance) }}
              </span>
            </div>
          </div>
          <div class="card-actions">
            <button @click="editAccount(account)" class="btn-edit">
              Editar
            </button>
            <button
              @click="deleteAccount(account.id)"
              :disabled="deletingId === account.id"
              class="btn-delete"
            >
              {{ deletingId === account.id ? '...' : 'Remover' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { accounts, loading, fetchAccounts, createAccount, deleteAccount: deleteAccountApi } = useAccounts()

const showForm = ref(false)
const creatingAccount = ref(false)
const deletingId = ref<number | null>(null)
const editingId = ref<number | null>(null)

const formData = reactive({
  id: null as number | null,
  name: '',
  type: '',
  balance: 0,
})

const getAccountType = (type: string) => {
  const types: Record<string, string> = {
    checking: 'Corrente',
    saving: 'Poupança',
    investment: 'Investimento',
  }
  return types[type] || type
}

const formatAmount = (amount: number) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return formatter.format(amount / 100)
}

const handleCreateAccount = async () => {
  creatingAccount.value = true
  try {
    if (formData.id) {
      await updateAccount(formData.id, formData.name, formData.type)
    } else {
      await createAccount(formData.name, formData.type, formData.balance)
    }
    formData.name = ''
    formData.type = ''
    formData.balance = 0
    formData.id = null
    showForm.value = false
  } finally {
    creatingAccount.value = false
  }
}

const editAccount = (account: any) => {
  formData.id = account.id
  formData.name = account.name
  formData.type = account.type
  formData.balance = account.balance
  showForm.value = true
}

const deleteAccount = async (id: number) => {
  deletingId.value = id
  try {
    await deleteAccountApi(id)
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchAccounts()
})
</script>

