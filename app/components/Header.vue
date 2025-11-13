<template>
  <!-- Header -->
  <header class="z-50 sticky top-0 w-full bg-card border-b border-border shadow-sm">
    <div class="flex items-center justify-between p-4 md:px-8">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-primary text-3xl font-bold"
      >
        <nuxt-img
          src="/logo.png"
          alt="Logo de l'application"
          width="36"
          height="36"
          class="rounded-lg"
        />
        wish
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="px-4 flex-1 hidden md:flex gap-6 text-foreground">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hover:text-primary transition-colors"
          :class="{ 'font-semibold text-primary': $route.path === item.to }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Desktop User Section -->
      <div class="hidden md:flex items-center gap-3 text-sm text-foreground">
        <span class="font-medium">Utilisateur</span>
        <button
          class="logout-button text-muted-foreground hover:text-destructive transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Menu"
        @click="toggleMenu"
      >
        <Icon
          :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'"
          class="w-6 h-6 text-foreground"
        />
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div
        v-if="isMenuOpen"
        class="md:hidden flex flex-col gap-3 bg-card border-t border-border p-4 text-foreground text-base"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hover:text-primary transition-colors"
          :class="{ 'font-semibold text-primary': $route.path === item.to }"
          @click="closeMenu"
        >
          {{ item.label }}
        </NuxtLink>

        <div class="border-t border-border mt-3 pt-3 flex items-center justify-between">
          <span class="font-medium">Utilisateur</span>
          <button
            class="logout-button text-muted-foreground hover:text-destructive transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)
const closeMenu = () => (isMenuOpen.value = false)

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Recherche', to: '/search' },
  { label: 'Autour de moi', to: '/map' },
]
</script>

<style scoped>
/* Small animation for dropdown */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
