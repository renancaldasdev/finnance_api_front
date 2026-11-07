---
name: new-component
description: Scaffold Vue components with design system compliance and Tailwind tokens
disable-model-invocation: false
---

# New Component Scaffold

Creates a new Vue 3 component following your Finannce design system: uses Tailwind token-based utilities, enforces design patterns (cards, buttons, forms), and includes TypeScript prop definitions.

## Usage

```bash
/new-component ComponentName [type]
```

**Types** (optional):

- `button` — Styled button component
- `card` — Card container with border and padding
- `form` — Form component with fields
- `modal` — Modal dialog
- `list` — List/table display
- Default (omit type) — General container component

## Output

Generates `app/components/ComponentName.vue` with:

- Vue 3 Composition API + `<script setup>`
- Full TypeScript prop definitions with JSDoc
- Tailwind utilities using design tokens
- Responsive layout with clamp-based sizing
- Accessibility attributes (ARIA labels, semantic HTML)

## Examples

### Button Component

```bash
/new-component PrimaryButton button
```

```vue
<script setup lang="ts">
interface Props {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

defineProps<Props>();
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="px-6 py-3 min-h-[44px] bg-brand text-white rounded-md hover:bg-brand-strong transition-colors disabled:opacity-50"
  >
    {{ loading ? '...' : label }}
  </button>
</template>
```

### Card Component

```bash
/new-component TransactionCard card
```

```vue
<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-surface-raised border border-line rounded-lg p-6">
    <h3 class="text-lg font-600 text-ink mb-2">{{ title }}</h3>
    <p v-if="description" class="text-sm text-ink-soft">{{ description }}</p>
    <slot />
  </div>
</template>
```

### Form Component

```bash
/new-component AccountForm form
```

```vue
<script setup lang="ts">
import { reactive } from 'vue';

interface FormData {
  name: string;
  email: string;
}

const form = reactive<FormData>({ name: '', email: '' });

const emit = defineEmits<{ submit: [data: FormData] }>();

const handleSubmit = () => {
  emit('submit', form);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-500 mb-2">Name</label>
      <input
        v-model="form.name"
        type="text"
        class="w-full px-4 py-2 border border-line rounded-md"
      />
    </div>
    <button type="submit" class="px-6 py-3 bg-brand text-white rounded-md">Submit</button>
  </form>
</template>
```

## Design System Rules

✅ **DO**:

- Use token-based Tailwind: `bg-brand`, `text-ink`, `border-line`, `rounded-lg`, `p-6`
- Responsive spacing: `clamp()` for padding and margins
- Min-height 44px for interactive elements (buttons, inputs)
- Use `font-*` utilities: 400–800 weight options available
- Include semantic HTML: `<button>`, `<form>`, `<label>`, `<fieldset>`
- Add ARIA labels for accessibility

❌ **DON'T**:

- Hardcode hex colors: `#FF0000`, `rgb(255, 0, 0)`
- Use `<style scoped>` blocks—all styling in template class attributes
- Use Tailwind arbitrary values: `rounded-[12px]`
- Mix design system tokens with custom CSS

## Design Tokens Available

**Colors**: `brand`, `brand-strong`, `ink`, `ink-soft`, `surface-raised`, `line`, `danger`, `warning-soft`, `success`

**Spacing**: `space-1` (4px) → `space-10` (40px)

**Radius**: `rounded-sm` (8px), `rounded-md` (10px), `rounded-lg` (16px), `rounded-xl`

**Typography**: Manrope font (400–800 weight)

See `app/app.css` for full token definitions.

## Component Patterns

**Cards**: `bg-surface-raised border border-line rounded-lg p-6`

**Buttons**: `px-6 py-3 min-h-[44px] bg-brand hover:bg-brand-strong rounded-md transition-colors`

**Inputs**: `w-full px-4 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-brand`

**Sidebar**: 240px base width, `flex flex-col gap-4`

## Usage Example

Once created, use in any page:

```vue
<template>
  <div class="p-8">
    <PrimaryButton label="Save" @click="handleSave" />
  </div>
</template>

<script setup>
import PrimaryButton from '@/components/PrimaryButton.vue';

const handleSave = () => console.log('Saved!');
</script>
```

Auto-imports work—no `import` needed if you follow naming conventions.
