<template>
  <AppShell>
    <div class="categories-page">
      <div class="header">
        <h1>Categorias</h1>
        <button @click="showForm = !showForm" class="btn-primary">
          {{ showForm ? 'Cancelar' : 'Nova Categoria' }}
        </button>
      </div>

      <div v-if="showForm" class="form-card">
        <h2>{{ formData.id ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
        <form @submit.prevent="handleCreateCategory" class="form">
          <div class="form-group">
            <label>Nome</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Ex: Alimentação"
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
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>

          <button type="submit" :disabled="creatingCategory" class="btn-primary">
            {{
              creatingCategory
                ? formData.id
                  ? 'Salvando...'
                  : 'Criando...'
                : formData.id
                  ? 'Salvar'
                  : 'Criar Categoria'
            }}
          </button>
        </form>
      </div>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="categories.length === 0" class="empty">Nenhuma categoria encontrada</div>

      <div v-else class="table-wrapper">
        <table class="categories-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.name }}</td>
              <td :class="`type-${category.type}`">
                {{ getCategoryType(category.type) }}
              </td>
              <td>
                <span :class="['status-badge', category.is_active ? 'active' : 'inactive']">
                  {{ category.is_active ? 'Ativa' : 'Inativa' }}
                </span>
              </td>
              <td class="actions">
                <button
                  @click="toggleCategory(category.id)"
                  :disabled="togglingId === category.id"
                  class="btn-toggle"
                >
                  {{
                    togglingId === category.id ? '...' : category.is_active ? 'Desativar' : 'Ativar'
                  }}
                </button>
                <button @click="editCategory(category)" class="btn-edit">Editar</button>
                <button
                  @click="deleteCategory(category.id)"
                  :disabled="deletingId === category.id"
                  class="btn-delete"
                >
                  {{ deletingId === category.id ? '...' : 'Remover' }}
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
import type { Category } from '~/types';

definePageMeta({
  middleware: 'auth',
});

const {
  categories,
  loading,
  fetchCategories,
  createCategory,
  toggleCategory: toggleCategoryApi,
  deleteCategory: deleteCategoryApi,
} = useCategories();

const showForm = ref(false);
const creatingCategory = ref(false);
const deletingId = ref<number | null>(null);
const togglingId = ref<number | null>(null);

const formData = reactive({
  id: null as number | null,
  name: '',
  type: '',
});

const getCategoryType = (type: string) => {
  return type === 'income' ? 'Receita' : 'Despesa';
};

const handleCreateCategory = async () => {
  creatingCategory.value = true;
  try {
    await createCategory(formData.name, formData.type);
    formData.name = '';
    formData.type = '';
    formData.id = null;
    showForm.value = false;
  } finally {
    creatingCategory.value = false;
  }
};

const editCategory = (category: Category) => {
  formData.id = category.id;
  formData.name = category.name;
  formData.type = category.type;
  showForm.value = true;
};

const toggleCategory = async (id: number) => {
  togglingId.value = id;
  try {
    await toggleCategoryApi(id);
  } finally {
    togglingId.value = null;
  }
};

const deleteCategory = async (id: number) => {
  deletingId.value = id;
  try {
    await deleteCategoryApi(id);
  } finally {
    deletingId.value = null;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
