<template>
    <!-- Header -->
    <header class="z-50 sticky top-0 w-full bg-card border-b border-border shadow-sm">
        <div class="flex items-center justify-between p-4 md:px-8">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-2 text-primary text-3xl font-bold">
                <nuxt-img src="/logo.png" alt="Logo de l'application" width="36" height="36" class="rounded-lg" />
                wish
            </NuxtLink>

            <!-- Desktop Navigation -->
            <nav class="px-4 flex-1 hidden md:flex gap-6 text-foreground">
                <NuxtLink
                    v-for="item in navItems" :key="item.to" :to="item.to"
                    class="hover:text-primary transition-colors"
                    :class="{ 'font-semibold text-primary': $route.path === item.to }"
                    >
                    {{ item.label }}
                </NuxtLink>
            </nav>

            <!-- Desktop User Section -->
            <div class="hidden md:flex items-center gap-3 text-sm text-foreground relative">
                <template v-if="userStore.loggedIn">
                    <button
                        class="flex items-center gap-2 hover:text-primary transition-colors"
                        @click="toggleDropdown"
                    >
                        <Icon name="mdi:account-circle" class="w-12 h-12 text-foreground" />
                        <span class="font-medium">{{ userStore.username }}</span>
                        <Icon name="mdi:chevron-down" class="w-4 h-4 text-muted-foreground"/>
                    </button>

                    <!-- Dropdown -->
                    <transition name="slide-fade">
                        <div
                            v-if="isDropdownOpen"
                            class="absolute top-full right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-md py-2 z-50"
                        >
                            <NuxtLink
                                to="/profile"
                                class="block px-4 py-2 hover:bg-muted transition-colors"
                                @click="closeDropdown"
                            >
                                Profil
                            </NuxtLink>
                            <button
                                class="block w-full text-left px-4 py-2 text-destructive hover:bg-muted transition-colors"
                                @click="logout">
                                Déconnexion
                            </button>
                        </div>
                    </transition>
                </template>

                <template v-else>
                    <NuxtLink
                        to="/login"
                        class="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                    >
                        Se connecter
                    </NuxtLink>
                </template>
            </div>

            <!-- Mobile Menu Button -->
            <button
                class="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Menu"
                @click="toggleMenu"
            >
                <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6 text-foreground" />
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

                <div class="border-t border-border mt-3 pt-3">
                    <template v-if="userStore.loggedIn">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <Icon name="mdi:account-circle" class="w-5 h-5" />
                                <span class="font-medium">{{ userStore.username }}</span>
                            </div>
                        </div>
                        <NuxtLink
                            to="/profile"
                            class="block py-1 hover:text-primary transition-colors"
                            @click="closeMenu">
                            Profil
                        </NuxtLink>
                        <button
                            class="w-full text-left py-1 text-destructive hover:text-destructive/80 transition-colors"
                            @click="logout">
                            Déconnexion
                        </button>
                    </template>

                    <template v-else>
                        <div class="flex justify-center">
                            <Button
                                as="NuxtLink"
                                to="/login"
                                @click="closeMenu"
                            >
                                Se connecter
                            </Button>
                        </div>
                    </template>
                </div>
            </div>
        </transition>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)
const closeMenu = () => (isMenuOpen.value = false)
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value)
const closeDropdown = () => (isDropdownOpen.value = false)

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
    userStore.loggedIn = false
    userStore.username = ''
    closeMenu()
    closeDropdown()
    router.push('/')
}

const navItems = [
    { label: 'Accueil', to: '/' },
    { label: 'Recherche', to: '/search' },
    { label: 'Autour de moi', to: '/map' },
]
</script>

<style scoped>
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
