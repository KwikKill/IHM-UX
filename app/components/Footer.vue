<template>
    <footer class="bg-card border-t border-border text-foreground py-4 px-3 md:px-12">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <!-- Brand -->
            <div class="flex flex-col items-center md:items-center">
                <span class="text-sm text-muted-foreground">© 2025 Sysrez™ — Tous droits réservés</span>
            </div>

            <!-- Links -->
            <div class="flex justify-center flex-wrap gap-4 text-sm font-medium">
                <NuxtLink to="/" class="hover:text-primary transition-colors">
                    Plan du site
                </NuxtLink>
                <NuxtLink to="/contact" class="hover:text-primary transition-colors">
                    Contact
                </NuxtLink>
                <NuxtLink to="/about" class="hover:text-primary transition-colors">
                    À propos
                </NuxtLink>
            </div>

            <!-- Legal / Social -->
            <div class="flex flex-col md:items-center items-center gap-2">
                <div class="flex flex-wrap justify-center md:justify-end gap-4 text-sm font-medium">
                    <NuxtLink to="/terms" class="hover:text-primary transition-colors">
                        Conditions d'utilisation
                    </NuxtLink>
                    <NuxtLink to="/privacy" class="hover:text-primary transition-colors">
                        Politique de confidentialité
                    </NuxtLink>
                </div>
            </div>
        </div>
    </footer>
</template>
