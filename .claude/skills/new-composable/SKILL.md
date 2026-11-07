---
name: new-composable
description: Scaffold new API composables following the existing pattern (useApi + entity CRUD)
disable-model-invocation: false
---

# New Composable Scaffold

Creates a new composable with the standard pattern used in this project: CRUD operations (fetch, create, update, delete) using the `useApi()` composable.

## Usage

```bash
/new-composable EntityName
```

## Output

Generates `app/composables/useEntityName.ts` with:

- Reactive state for entity list
- Fetch, create, update, delete methods using `useApi()` helpers
- Error handling that mirrors existing composables
- Full TypeScript types

## Example

```bash
/new-composable Budget
```

Generates:

```typescript
// app/composables/useBudget.ts
export const useBudget = () => {
  const { get, post, put, del } = useApi();
  const budgets = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBudgets = async () => {
    loading.value = true;
    try {
      const data = await get('/budgets');
      budgets.value = data.data || data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch budgets';
    } finally {
      loading.value = false;
    }
  };

  const create = async (payload: any) => {
    try {
      const response = await post('/budgets', payload);
      const newBudget = response.data || response;
      budgets.value.push(newBudget);
      return newBudget;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create budget';
      throw err;
    }
  };

  const update = async (id: number, payload: any) => {
    try {
      const response = await put(`/budgets/${id}`, payload);
      const updated = response.data || response;
      const idx = budgets.value.findIndex((b) => b.id === id);
      if (idx >= 0) budgets.value[idx] = updated;
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update budget';
      throw err;
    }
  };

  const destroy = async (id: number) => {
    try {
      await del(`/budgets/${id}`);
      budgets.value = budgets.value.filter((b) => b.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete budget';
      throw err;
    }
  };

  return { budgets, loading, error, fetchBudgets, create, update, destroy };
};
```

## Pattern Notes

- **API endpoint**: Pluralized lowercase entity name (e.g., `/budgets`, `/accounts`)
- **Method names**: `fetch[Entities]` for list, `create`, `update`, `destroy` for CRUD
- **Error handling**: Wrapped in try/catch with reactive error state
- **Response formats**: Handles both `{ data: [...] }` and direct `[...]` formats
- **Types**: Extend as needed; any[] is fine for MVP, replace with generated types later

## Existing Composables

Study these patterns:

- `useTransactions.ts` — Full CRUD with form modal
- `useAccounts.ts` — Account-specific methods
- `useAuth.ts` — Authentication flow
- `useCategories.ts` — Category management
