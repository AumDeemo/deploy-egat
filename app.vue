<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { useAuthStore } from '#build/imports';

// localStorage.setItem('role' , 'users')

const authStore = useAuthStore()

authStore.initializeAuth()
</script>