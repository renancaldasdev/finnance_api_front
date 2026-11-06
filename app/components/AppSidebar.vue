<template>
  <nav class="w-60 bg-sidebar text-sidebar-ink p-[28px_18px] flex flex-col gap-7 hidden md:flex md:min-h-screen">
    <!-- Logo -->
    <div class="flex items-center gap-2.5 px-2.5">
      <div class="w-8.5 h-8.5 rounded-[10px] bg-brand flex items-center justify-center">
        <svg class="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20H2" />
        </svg>
      </div>
      <span class="text-xl font-800 text-on-brand tracking-tight">finannce</span>
    </div>

    <!-- Navigation -->
    <div class="flex flex-col gap-1">
      <NuxtLink
        to="/dashboard"
        class="flex items-center gap-3 min-h-11 px-3 rounded-[10px] text-sm font-bold text-white bg-sidebar-active transition-colors hover:bg-sidebar-active"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
        Visão geral
      </NuxtLink>

      <NuxtLink
        to="/transactions"
        class="flex items-center gap-3 min-h-11 px-3 rounded-[10px] text-sm font-semibold text-sidebar-ink transition-colors hover:text-white hover:bg-sidebar-active"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 4v16" />
          <path d="M3 8l4-4 4 4" />
          <path d="M17 20V4" />
          <path d="M21 16l-4 4-4-4" />
        </svg>
        Transações
      </NuxtLink>

      <NuxtLink
        to="/accounts"
        class="flex items-center gap-3 min-h-11 px-3 rounded-[10px] text-sm font-semibold text-sidebar-ink transition-colors hover:text-white hover:bg-sidebar-active"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10l9-6 9 6" />
          <path d="M5 10v9" />
          <path d="M19 10v9" />
          <path d="M9.5 10v9" />
          <path d="M14.5 10v9" />
          <path d="M3 21h18" />
        </svg>
        Contas
      </NuxtLink>

      <NuxtLink
        to="/categories"
        class="flex items-center gap-3 min-h-11 px-3 rounded-[10px] text-sm font-semibold text-sidebar-ink transition-colors hover:text-white hover:bg-sidebar-active"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
        Categorias
      </NuxtLink>
    </div>

    <!-- User Section -->
    <div class="mt-auto flex items-center gap-3 p-[10px_6px_10px_12px] rounded-3xl bg-[#17241F]">
      <div class="w-9 h-9 rounded-full bg-[#2C3D37] flex items-center justify-center font-bold text-sm text-sidebar-ink flex-shrink-0">
        {{ userInitial }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-bold text-white truncate">{{ user?.name }}</div>
        <div class="text-xs text-[#A7B3AE] truncate">Editar perfil</div>
      </div>
      <button
        @click="handleLogout"
        class="w-11 h-11 rounded-[10px] flex items-center justify-center text-sidebar-ink transition-colors hover:bg-sidebar-active flex-shrink-0"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const userInitial = computed(() => {
  return user.value?.name?.[0]?.toUpperCase() || 'U'
})

const handleLogout = async () => {
  await logout()
}
</script>
