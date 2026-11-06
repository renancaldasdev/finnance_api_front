<template>
  <div class="flex min-h-screen bg-surface text-ink font-sans flex-wrap md:flex-row">
    <AppSidebar />
    <main class="flex-1 p-[32px_clamp(16px,3vw,40px)_48px] overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
