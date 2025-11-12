<template>
    <div class="z-99 header flex flex-row w-full p-4 items-center bg-card sticky top-0 gap-8">
        <div>
            <NuxtLink to="/" class="text-primary text-4xl font-bold flex flex-row items-center gap-1">
                <nuxt-img
                    src="/logo.png"
                    alt="Logo de l'application"
                    width="40"
                    height="40"
                    class="rounded-lg"
                />
                wish
            </NuxtLink>
        </div>
        <nav class="flex gap-4 flex-1">
            <NuxtLink
                to="/"
                class="hover:underline"
                :class="{ 'font-bold text-primary': $route.path === '/' }"
            >
                Accueil
            </NuxtLink>
            <NuxtLink
                to="/search"
                class="hover:underline"
                :class="{ 'font-bold text-primary': $route.path === '/search' }"
            >
                Recherche
            </NuxtLink>
            <NuxtLink
                to="/map"
                class="hover:underline"
                :class="{ 'font-bold text-primary': $route.path === '/map' }"
            >
                Autour de moi
            </NuxtLink>
        </nav>
        <div class="flex justify-end gap-2">
            <span>Utilisateur</span>
            <button class="logout-button">Déconnexion</button>
        </div>
    </div>
</template>