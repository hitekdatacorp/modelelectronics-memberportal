<script setup lang="ts">
 import { useAuthStore } from '@/stores/auth-store';


const store = useAuthStore();

</script>

<template>
  <main class="about">
    <h1>This is an about page</h1>s
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 50vh;
    display: flex;
    align-items: center;
  }
}
</style>
