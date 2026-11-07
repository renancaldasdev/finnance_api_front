import type { Category, ApiResponse } from '~/types';

export const useCategories = () => {
  const { get, post, put, patch, del } = useApi();

  const categories = ref<Category[]>([]);
  const loading = ref(false);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const data = (await get('/categories')) as ApiResponse<Category[]>;
      categories.value = data.data || (data as unknown as Category[]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (name: string, type: string): Promise<Category> => {
    try {
      const res = (await post('/categories', { name, type })) as ApiResponse<Category>;
      const data = res.data || (res as unknown as Category);
      categories.value.push(data);
      return data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: number, name: string): Promise<Category> => {
    try {
      const res = (await put(`/categories/${id}`, { name })) as ApiResponse<Category>;
      const data = res.data || (res as unknown as Category);
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = data;
      return data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const toggleCategory = async (id: number): Promise<Category> => {
    try {
      const res = (await patch(`/categories/${id}/toggle-status`, {})) as ApiResponse<Category>;
      const data = res.data || (res as unknown as Category);
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = data;
      return data;
    } catch (error) {
      console.error('Failed to toggle category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await del(`/categories/${id}`);
      categories.value = categories.value.filter((c) => c.id !== id);
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    toggleCategory,
    deleteCategory,
  };
};
