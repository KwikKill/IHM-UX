<template>
    <main class="flex items-center justify-center min-h-screen p-6" role="main" aria-labelledby="about-title">
        <div class="w-[92vw] md:w-[70vw]">
            <Card class="w-full p-8 rounded-lg shadow-md">
                <h1 id="about-title" class="text-3xl font-semibold">À propos</h1>

                <p class="lead mt-3 text-base">
                    Cette application a été développée pour fournir des informations de transport et d'alertes en temps réel.
                    Elle utilise les données publiques mises à disposition par la métropole de Rennes.
                </p>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">Source des données</h2>
                    <p class="text-base mt-2">
                        Les données sont récupérées depuis l'API Open Data de Rennes Métropole (
                        <a href="https://data.rennesmetropole.fr" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">https://data.rennesmetropole.fr</a>
                        ). Les jeux de données consultés depuis le store incluent notamment :
                    </p>
                    <ul class="list-disc pl-5 mt-2">
                        <li>Prochains passages des lignes de bus du réseau STAR (prochains-passages...)</li>
                        <li>Topologie et points d'arrêt des lignes de bus (tco-bus-topologie..., topologie-des-points-darret...)</li>
                        <li>Horaires et plans du réseau (horaires-et-plans...)</li>
                        <li>Alerte trafic en temps réel (alertes-trafic...)</li>
                        <li>Pictogrammes et informations lignes (pictogrammes-des-lignes...)</li>
                    </ul>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">Comment les données sont utilisées</h2>
                    <p class="text-base mt-2">
                        L'application interroge ces endpoints publics et stocke les résultats dans le store local (`data.store.ts`).
                        Les requêtes sont paginées et consolidées pour récupérer les jeux de données complets lorsque nécessaire.
                    </p>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-medium">Licence et attribution</h2>
                    <p class="text-base mt-2">
                        Les données publiées par Rennes Métropole sont soumises aux conditions et licences indiquées sur la plateforme Open Data.
                        Veuillez consulter la source originale pour les conditions d'utilisation et l'attribution.
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

const updated = '13 novembre 2025';

</script>
