export const useCategories = () => {
  const { get, post, put, patch, del } = useApi();

  const categories = ref<any[]>([]);
  const loading = ref(false);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const data = await get('/categories');
      categories.value = data.data || data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (name: string, type: string) => {
    try {
      const res = await post('/categories', { name, type });
      const data = res.data || res;
      categories.value.push(data);
      return data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: number, name: string) => {
    try {
      const res = await put(`/categories/${id}`, { name });
      const data = res.data || res;
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = data;
      return data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const toggleCategory = async (id: number) => {
    try {
      const res = await patch(`/categories/${id}/toggle-status`, {});
      const data = res.data || res;
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
