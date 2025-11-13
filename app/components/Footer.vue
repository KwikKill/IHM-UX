<template>
  <footer class="bg-card border-t border-border text-foreground py-6 px-6 md:px-12">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-3 items-center">
      
      <!-- Brand / Copyright -->
      <div class="flex justify-center md:justify-start">
        <span class="text-sm text-muted-foreground">© 2025 Sysrez™ — Tous droits réservés</span>
      </div>

      <!-- Main Links -->
      <div class="flex justify-center flex-wrap md:gap-4 gap-3 text-sm font-medium">
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

      <!-- Legal Links -->
      <div class="flex justify-center md:justify-end flex-wrap md:gap-4 gap-3 text-sm font-medium">
        <NuxtLink to="/terms" class="hover:text-primary transition-colors">
          Conditions d'utilisation
        </NuxtLink>
        <NuxtLink to="/privacy" class="hover:text-primary transition-colors">
          Politique de confidentialité
        </NuxtLink>
      </div>

    </div>
  </footer>
</template>
