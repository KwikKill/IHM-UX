<template>
    <div class="footer bg-card text-primary grid grid-cols-3">
        <div>
            <span>Copyright Sysrez(TM) 2025</span>
        </div>
        <div class="flex justify-center gap-2">
            <div>
                <NuxtLink to="/" class="">Plan du site</NuxtLink>
            </div>
            <div>
                <NuxtLink to="/contact" class="">Contact</NuxtLink>
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <div>
                <NuxtLink to="/terms" class="">Conditions d'utilisation</NuxtLink>
            </div>
            <div>
                <NuxtLink to="/privacy" class="">Politique de confidentialité</NuxtLink>
            </div>
        </div>
    </div>
</template>