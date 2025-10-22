<template>
    <div class="header grid grid-cols-3 p-4 items-center bg-card text-primary gap-2 sticky top-0">
        <div>
            <NuxtLink to="/" class="text-3xl font-bold"><Icon name="material-symbols:format-letter-spacing-wider" size="2rem"/></NuxtLink>
        </div>
        <nav class="flex justify-center gap-4">
            <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
            <NuxtLink to="/search" class="hover:underline">Recherche</NuxtLink>
            <NuxtLink to="/map" class="hover:underline">Autour de moi</NuxtLink>
        </nav>
        <div class="flex justify-end gap-2">
            <span>Utilisateur</span>
            <button class="logout-button">Déconnexion</button>
        </div>
    </div>
</template>