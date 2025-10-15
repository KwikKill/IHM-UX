<template>
    <div class="header flex justify-between items-center p-4 bg-primary text-white gap-2">
        <h1>Swish</h1>
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