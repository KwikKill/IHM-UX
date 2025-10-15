<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
</script>

<template>
  <Header/>
  <div class="flex flex-1 flex-col">
    <NuxtPage />
  </div>
  <Footer/>
</template>
