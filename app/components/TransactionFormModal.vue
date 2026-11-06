<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button @click="close" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <div v-if="mode === 'transfer'" class="form-group">
            <label>Conta de Origem</label>
            <select v-model="formData.originAccountId" class="form-input" required>
              <option value="">Selecione uma conta</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>

          <div v-if="mode !== 'transfer'" class="form-group">
            <label>Conta</label>
            <select v-model="formData.accountId" class="form-input" required>
              <option value="">Selecione uma conta</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>

          <div v-if="mode !== 'transfer'" class="form-group">
            <label>Categoria</label>
            <select v-model="formData.categoryId" class="form-input" required>
              <option value="">Selecione uma categoria</option>
              <option
                v-for="category in filteredCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div v-if="mode === 'transfer'" class="form-group">
            <label>Conta de Destino</label>
            <select v-model="formData.destinationAccountId" class="form-input" required>
              <option value="">Selecione uma conta</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Descrição</label>
            <input
              v-model="formData.description"
              type="text"
              placeholder="Ex: Mercado"
              class="form-input"
              maxlength="255"
              required
            />
          </div>

          <div class="form-group">
            <label>Valor (centavos)</label>
            <input
              v-model.number="formData.amount"
              type="number"
              placeholder="0"
              class="form-input"
              required
              min="100"
            />
          </div>

          <div v-if="mode !== 'transfer'" class="form-group">
            <label>Pago?</label>
            <input v-model="formData.isPaid" type="checkbox" class="form-checkbox" />
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="submitting" class="btn-primary">
              {{ submitting ? 'Salvando...' : 'Salvar' }}
            </button>
            <button type="button" @click="close" class="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  mode?: 'income' | 'expense' | 'transfer'
  accounts: any[]
  categories: any[]
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const mode = computed(() => props.mode || 'expense')
const submitting = ref(false)
const errorMessage = ref('')

const formData = reactive({
  accountId: '',
  categoryId: '',
  originAccountId: '',
  destinationAccountId: '',
  description: '',
  amount: 0,
  isPaid: false,
})

const title = computed(() => {
  if (mode.value === 'transfer') return 'Transferência'
  if (mode.value === 'income') return 'Nova Receita'
  return 'Nova Despesa'
})

const filteredCategories = computed(() =>
  props.categories.filter(
    c => c.type === mode.value && c.is_active !== false
  )
)

const close = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.accountId = ''
  formData.categoryId = ''
  formData.originAccountId = ''
  formData.destinationAccountId = ''
  formData.description = ''
  formData.amount = 0
  formData.isPaid = false
  errorMessage.value = ''
}

const handleSubmit = async () => {
  if (mode.value === 'transfer' && formData.amount < 100) {
    errorMessage.value = 'Transferência mínima é R$ 1,00'
    return
  }

  submitting.value = true
  try {
    emit('submit', {
      ...formData,
      type: mode.value === 'transfer' ? 'transfer' : mode.value,
    })
    resetForm()
  } finally {
    submitting.value = false
  }
}
</script>

