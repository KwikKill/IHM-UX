<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
</script>

<template>
  <Header/>
  <div class="flex flex-1 flex-col">
    <NuxtPage />
  </div>
  <Footer/>
</template>
