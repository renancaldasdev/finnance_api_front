<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

onMounted(() => {
  const { initToken } = useAuth();
  initToken();
});
</script>
