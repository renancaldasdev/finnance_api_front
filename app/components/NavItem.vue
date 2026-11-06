<template>
  <NuxtLink :to="to" :class="['nav-item', { active: isActive }]">
    <span class="icon">{{ icon }}</span>
    <span class="label">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  icon: string
  label: string
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

