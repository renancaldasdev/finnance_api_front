<template>
  <aside class="w-60 bg-sidebar text-sidebar-ink p-4 flex flex-col md:flex-col md:w-60 hidden md:flex">
    <div class="mb-8">
      <h1 class="text-2xl font-800 text-on-brand m-0">Finannce</h1>
    </div>
    <nav class="flex-1 flex flex-col gap-2">
      <NavItem to="/" icon="📊" label="Dashboard" />
      <NavItem to="/accounts" icon="🏦" label="Contas" />
      <NavItem to="/categories" icon="🏷️" label="Categorias" />
      <NavItem to="/transactions" icon="📝" label="Transações" />
    </nav>
    <div class="border-t border-sidebar-active pt-4 flex flex-col gap-2">
      <div class="text-sm px-3">
        <span>{{ user?.name }}</span>
      </div>
      <button @click="handleLogout" class="bg-transparent border-0 text-sidebar-ink cursor-pointer p-2 px-3 rounded-md text-sm text-left transition-colors hover:bg-sidebar-active">Sair</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>
