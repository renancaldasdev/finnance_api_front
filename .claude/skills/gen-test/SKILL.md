---
name: gen-test
description: Generate Vitest unit tests for composables, components, and pages
disable-model-invocation: false
---

# Generate Tests

Generates comprehensive Vitest unit tests for TypeScript files (composables, utilities) and Vue component tests using `@testing-library/vue`.

## Usage

```bash
/gen-test app/composables/useTransactions.ts
/gen-test app/components/TransactionFormModal.vue
/gen-test app/pages/dashboard.vue
```

## Output

- **Composables** → `app/composables/__tests__/useEntityName.test.ts`
- **Components** → `app/components/__tests__/ComponentName.test.ts`
- **Pages** → `app/pages/__tests__/pageName.test.ts`

## Test Structure

### Composable Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTransactions } from '../useTransactions';

describe('useTransactions', () => {
  let useApiMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    useApiMock = vi.fn(() => ({
      get: vi.fn().mockResolvedValue({ data: [] }),
      post: vi.fn().mockResolvedValue({ data: {} }),
      put: vi.fn().mockResolvedValue({ data: {} }),
      del: vi.fn().mockResolvedValue({}),
    }));
    vi.mock('../composables/useApi', () => ({ useApi: useApiMock }));
  });

  it('should fetch transactions', async () => {
    const { transactions, fetchTransactions } = useTransactions();
    await fetchTransactions();
    expect(transactions.value).toEqual([]);
  });

  it('should handle errors gracefully', async () => {
    // Mock error scenario
  });
});
```

### Component Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import TransactionFormModal from '../TransactionFormModal.vue';

describe('TransactionFormModal', () => {
  it('should render the form', () => {
    render(TransactionFormModal);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should emit save event on submit', async () => {
    const { emitted } = render(TransactionFormModal);
    // Trigger form submission
    expect(emitted('save')).toBeDefined();
  });
});
```

## Running Tests

```bash
npm run test        # Run all tests once
npm run test:watch # Watch mode for development
npm run test:ui    # Visual UI for test results
```

## Coverage

Run coverage report:

```bash
npm run test:coverage
```

## What Gets Tested

- **Composables**: API calls, state mutations, error handling
- **Components**: Rendering, props, events, user interactions
- **Pages**: Route params, data fetching, form submissions

## Mocking Strategy

- Mock `useApi()` for composable tests (avoid real HTTP calls)
- Mock API responses with realistic test data
- Mock child components in isolated component tests

## Notes

- Tests live next to source files in `__tests__/` folders
- File naming: `FileName.test.ts` mirrors `FileName.ts`
- Use `vi.mock()` for Vitest mocks (not Jest syntax)
- Test financial calculations extra carefully (rounding, decimals)

## Running the Skill

```bash
/gen-test <path-to-file>
```

The skill will analyze the file and generate a comprehensive test suite.
