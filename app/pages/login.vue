<template>
  <div class="flex flex-wrap min-h-screen">
    <!-- Left Sidebar -->
    <section
      class="flex-1 basis-96 bg-sidebar text-sidebar-ink px-8 py-6 flex flex-col justify-between gap-12"
    >
      <!-- Logo -->
      <div class="flex gap-2.5 items-center">
        <div class="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-2xl">
          📊
        </div>
        <span class="text-xl font-800 text-on-brand">finannce</span>
      </div>

      <!-- Hero Text -->
      <div class="flex flex-col gap-5 max-w-md">
        <h1 class="text-4xl leading-tight font-800 text-white m-0">
          Suas contas, receitas e despesas em um só lugar.
        </h1>
        <p class="text-base leading-relaxed text-sidebar-ink m-0">
          Organize por categoria, acompanhe o que está em aberto e transfira entre contas sem perder
          o controle do saldo.
        </p>
      </div>

      <!-- Feature Badges -->
      <div class="flex flex-wrap gap-2.5">
        <span class="px-3.5 py-2 rounded-full bg-sidebar-active text-xs font-bold text-sidebar-ink"
          >Contas</span
        >
        <span class="px-3.5 py-2 rounded-full bg-sidebar-active text-xs font-bold text-sidebar-ink"
          >Categorias</span
        >
        <span class="px-3.5 py-2 rounded-full bg-sidebar-active text-xs font-bold text-sidebar-ink"
          >Transações</span
        >
        <span class="px-3.5 py-2 rounded-full bg-sidebar-active text-xs font-bold text-sidebar-ink"
          >Transferências</span
        >
      </div>
    </section>

    <!-- Right Form Section -->
    <section class="flex-1 basis-96 px-6 py-12 flex items-center justify-center overflow-y-auto">
      <!-- Login Form -->
      <form
        v-if="mode === 'login'"
        @submit.prevent="handleLogin"
        class="w-full max-w-md flex flex-col gap-4"
      >
        <!-- Tabs -->
        <div class="grid grid-cols-2 gap-1.5 p-1 bg-surface rounded-lg">
          <button
            type="button"
            class="min-h-11 border-0 rounded-md font-inherit text-sm font-bold cursor-pointer bg-surface-raised text-ink shadow-sm"
          >
            Entrar
          </button>
          <button
            type="button"
            @click="mode = 'register'"
            class="min-h-11 border-0 rounded-md font-inherit text-sm font-bold cursor-pointer bg-transparent text-ink-soft hover:bg-surface"
          >
            Criar conta
          </button>
        </div>

        <!-- Form Header -->
        <div class="flex flex-col gap-1.5">
          <h2 class="text-2xl font-800 text-ink m-0">Bem-vindo de volta</h2>
          <p class="text-base text-ink-muted m-0">Entre com seu e-mail e senha.</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="bg-warning-soft text-danger p-3 rounded-lg text-sm border-l-4 border-danger"
        >
          {{ errorMessage }}
        </div>

        <!-- Email Field -->
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold text-ink-muted">E-mail</span>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="voce@email.com"
            required
            autocomplete="email"
            class="min-h-12 px-4 border border-line rounded-lg bg-surface-raised font-inherit text-base font-medium text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-transparent"
          />
        </label>

        <!-- Password Field -->
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold text-ink-muted">Senha</span>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Mínimo de 8 caracteres"
            required
            minlength="8"
            autocomplete="current-password"
            class="min-h-12 px-4 border border-line rounded-lg bg-surface-raised font-inherit text-base font-medium text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-transparent"
          />
        </label>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="flex items-center justify-center min-h-12 rounded-lg bg-brand text-on-brand font-bold text-base border-0 cursor-pointer transition-all hover:bg-brand-strong disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Register Form -->
      <form
        v-if="mode === 'register'"
        @submit.prevent="handleRegister"
        class="w-full max-w-md flex flex-col gap-4"
      >
        <!-- Tabs -->
        <div class="grid grid-cols-2 gap-1.5 p-1 bg-surface rounded-lg">
          <button
            type="button"
            @click="mode = 'login'"
            class="min-h-11 border-0 rounded-md font-inherit text-sm font-bold cursor-pointer bg-transparent text-ink-soft hover:bg-surface"
          >
            Entrar
          </button>
          <button
            type="button"
            class="min-h-11 border-0 rounded-md font-inherit text-sm font-bold cursor-pointer bg-surface-raised text-ink shadow-sm"
          >
            Criar conta
          </button>
        </div>

        <!-- Form Header -->
        <div class="flex flex-col gap-1.5">
          <h2 class="text-2xl font-800 text-ink m-0">Crie sua conta</h2>
          <p class="text-base text-ink-muted m-0">Comece a organizar suas finanças.</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="bg-warning-soft text-danger p-3 rounded-lg text-sm border-l-4 border-danger"
        >
          {{ errorMessage }}
        </div>

        <!-- Name Field -->
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold text-ink-muted">Nome</span>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="Seu nome completo"
            required
            autocomplete="name"
            class="min-h-12 px-4 border border-line rounded-lg bg-surface-raised font-inherit text-base font-medium text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-transparent"
          />
        </label>

        <!-- Email Field -->
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold text-ink-muted">E-mail</span>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="voce@email.com"
            required
            autocomplete="email"
            class="min-h-12 px-4 border border-line rounded-lg bg-surface-raised font-inherit text-base font-medium text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-transparent"
          />
        </label>

        <!-- Password Field -->
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold text-ink-muted">Senha</span>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="Mínimo de 8 caracteres"
            required
            minlength="8"
            autocomplete="new-password"
            class="min-h-12 px-4 border border-line rounded-lg bg-surface-raised font-inherit text-base font-medium text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-transparent"
          />
        </label>

        <!-- Confirm Password Field -->
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold text-ink-muted">Confirmar Senha</span>
          <input
            v-model="registerForm.password_confirmation"
            type="password"
            placeholder="Repita a senha"
            required
            minlength="8"
            autocomplete="new-password"
            class="min-h-12 px-4 border border-line rounded-lg bg-surface-raised font-inherit text-base font-medium text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-transparent"
          />
        </label>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="flex items-center justify-center min-h-[50px] rounded-[10px] bg-brand text-on-brand font-bold text-[15px] border-0 cursor-pointer transition-all hover:bg-brand-strong disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {{ loading ? 'Criando conta...' : 'Criar Conta' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getErrorMessage } from '~/types';

const mode = ref<'login' | 'register'>('login');

const loginForm = reactive({
  email: '',
  password: '',
});

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const loading = ref(false);
const errorMessage = ref('');
const { login, register } = useAuth();

// Form validation
const validateEmail = (email: string): string | null => {
  if (!email) return 'E-mail é obrigatório';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'E-mail inválido';
  return null;
};

const validatePassword = (password: string, minLength = 8): string | null => {
  if (!password) return 'Senha é obrigatória';
  if (password.length < minLength) return `Senha deve ter pelo menos ${minLength} caracteres`;
  return null;
};

const validateName = (name: string): string | null => {
  if (!name) return 'Nome é obrigatório';
  if (name.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
  return null;
};

const handleLogin = async () => {
  // Validate before submitting
  let error = validateEmail(loginForm.email);
  if (error) {
    errorMessage.value = error;
    return;
  }
  error = validatePassword(loginForm.password);
  if (error) {
    errorMessage.value = error;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await login(loginForm.email, loginForm.password);
  } catch (err: unknown) {
    errorMessage.value = getErrorMessage(err);
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  // Validate before submitting
  let error = validateName(registerForm.name);
  if (error) {
    errorMessage.value = error;
    return;
  }
  error = validateEmail(registerForm.email);
  if (error) {
    errorMessage.value = error;
    return;
  }
  error = validatePassword(registerForm.password);
  if (error) {
    errorMessage.value = error;
    return;
  }
  if (registerForm.password !== registerForm.password_confirmation) {
    errorMessage.value = 'As senhas não correspondem';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await register(
      registerForm.name,
      registerForm.email,
      registerForm.password,
      registerForm.password_confirmation
    );
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
};
</script>
