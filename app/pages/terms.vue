<template>
    <main class="flex items-center justify-center min-h-screen p-6" role="main" aria-labelledby="terms-title">
        <div class="w-[92vw] md:w-[70vw]">
            <Card class="w-full p-8 rounded-lg shadow-md">
                <h1 id="terms-title" class="text-3xl font-semibold">Conditions d'utilisation</h1>

                <p class="lead mt-3 text-base">
                    Merci d'utiliser cette application. En accédant ou en utilisant le service, vous acceptez ces conditions.
                </p>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">1. Acceptation des conditions</h2>
                    <p class="text-base mt-2">
                        En utilisant ce service, vous acceptez les présentes conditions d'utilisation et vous vous engagez à les respecter.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">2. Utilisation autorisée</h2>
                    <p class="text-base mt-2">
                        Vous vous engagez à n'utiliser le service que conformément à la loi et à ne pas effectuer d'actes susceptibles de nuire
                        au fonctionnement du service ou aux autres utilisateurs.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">3. Comptes et sécurité</h2>
                    <p class="text-base mt-2">
                        Si le service nécessite la création d'un compte, vous êtes responsable de la confidentialité de vos identifiants et de toute
                        activité réalisée avec votre compte. Informez-nous immédiatement en cas d'utilisation non autorisée.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">4. Propriété intellectuelle</h2>
                    <p class="text-base mt-2">
                        Tous les contenus fournis par le service (textes, images, logos, etc.) sont protégés par le droit d'auteur et restent la
                        propriété de leurs titulaires respectifs. Vous ne devez pas copier, reproduire ou distribuer ces contenus sans autorisation.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">5. Limitation de responsabilité</h2>
                    <p class="text-base mt-2">
                        Le service est fourni "tel quel". Nous ne garantissons pas l'absence d'erreurs et déclinons toute responsabilité pour les
                        dommages directs ou indirects résultant de l'utilisation du service, dans la mesure permise par la loi.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">6. Modifications</h2>
                    <p class="text-base mt-2">
                        Nous pouvons modifier ces conditions à tout moment. Les modifications seront publiées et la poursuite de l'utilisation du
                        service après publication vaudra acceptation des nouvelles conditions.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">7. Droit applicable</h2>
                    <p class="text-base mt-2">
                        Ces conditions sont régies par le droit applicable en vigueur. En cas de litige, les tribunaux compétents seront ceux
                        prévus par la loi applicable.
                    </p>
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
