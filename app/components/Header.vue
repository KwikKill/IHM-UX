<template>
    <div class="header flex justify-between items-center p-4 bg-primary text-white gap-2">
        <NuxtLink to="/" class="text-2xl font-bold"><Icon name="material-symbols:format-letter-spacing-wider" size="2rem"/></NuxtLink>
        <nav class="flex-1 flex justify-center gap-4">
            <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
            <NuxtLink to="/search" class="hover:underline">Recherche</NuxtLink>
            <NuxtLink to="/map" class="hover:underline">Autour de moi</NuxtLink>
        </nav>
        <div class="user-info">
            <span>Utilisateur</span>
            <button class="logout-button">Déconnexion</button>
        </div>
    </div>
</template>