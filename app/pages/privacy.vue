<template>
    <main class="flex items-center justify-center min-h-screen p-6" role="main" aria-labelledby="privacy-title">
        <div class="flex md:w-full justify-center">
            <Card class="flex p-8 rounded-lg shadow-md gap-4">
                <h1 id="privacy-title" class="text-3xl font-semibold">Politique de confidentialité</h1>

                <p class="lead mt-3 text-base">
                    Cette application respecte votre vie privée et conserve un minimum d'informations nécessaires au fonctionnement.
                </p>

                <div class="mt-6 space-y-4">
                    <Card class="p-4 rounded-md shadow-sm">
                        <h2 class="text-xl font-medium">Compte</h2>
                        <p class="text-base mt-2">
                            Le compte est utilisé uniquement pour garder en mémoire vos favoris et les synchroniser entre vos appareils.
                            Aucune autre donnée personnelle n'est collectée ou utilisée à des fins commerciales.
                        </p>
                    </Card>

                    <Card class="p-4 rounded-md shadow-sm">
                        <h2 class="text-xl font-medium">Localisation</h2>
                        <p class="text-base mt-2">
                            La localisation est utilisée localement par le navigateur pour améliorer certaines fonctionnalités (par exemple la recherche "autour de moi").
                            Les informations de localisation ne quittent jamais votre navigateur et ne sont pas transmises à nos serveurs.
                        </p>
                    </Card>

                    <Card class="p-4 rounded-md shadow-sm">
                        <h2 class="text-xl font-medium">Stockage et cookies</h2>
                        <p class="text-base mt-2">
                            Les préférences et les favoris peuvent être stockés dans le stockage local du navigateur ou via le compte,
                            selon votre choix. Les cookies éventuellement utilisés servent uniquement à maintenir la session ou les préférences.
                        </p>
                    </Card>

                    <Card class="p-4 rounded-md shadow-sm">
                        <h2 class="text-xl font-medium">Sécurité</h2>
                        <p class="text-base mt-2">
                            Nous mettons en œuvre des mesures raisonnables pour protéger les données stockées. Si vous souhaitez supprimer vos données,
                            vous pouvez supprimer votre compte ou effacer les données locales depuis le navigateur.
                        </p>
                    </Card>
                </div>

                <footer class="mt-6 text-sm">
                    <p>Dernière mise à jour : {{ updated }}</p>
                </footer>
            </Card>
        </div>
    </main>
</template>

<script setup lang="ts">

const dataStore = useDataStore()
const updated = dataStore.tosUpdated

</script>