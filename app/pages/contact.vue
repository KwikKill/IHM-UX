<template>
    <main class="flex items-center justify-center min-h-screen p-6" role="main" aria-labelledby="contact-title">
        <div class="w-[92vw] md:w-[70vw]">
            <Card class="w-full p-8 rounded-lg shadow-md">
                <h1 id="contact-title" class="text-3xl font-semibold">Contact</h1>

                <p class="lead mt-3 text-base">
                    Si vous avez des questions ou des retours, utilisez ce formulaire pour nous contacter.
                </p>

                <form class="mt-6 space-y-4" @submit.prevent="handleSubmit" aria-labelledby="contact-title">
                    <div>
                        <label for="name" class="block text-sm font-medium">Nom</label>
                        <input id="name" name="name" type="text" class="mt-1 block w-full border rounded-md p-2" />
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium">E‑mail</label>
                        <input id="email" name="email" type="email" class="mt-1 block w-full border rounded-md p-2" />
                    </div>

                    <div>
                        <label for="message" class="block text-sm font-medium">Message</label>
                        <textarea id="message" name="message" rows="5" class="mt-1 block w-full border rounded-md p-2"></textarea>
                    </div>

                    <div class="flex justify-end">
                        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Envoyer</button>
                    </div>
                </form>

                <footer class="mt-6 text-sm">
                    <p>Dernière mise à jour : {{ updated }}</p>
                </footer>
            </Card>
        </div>
    </main>
</template>

<script setup lang="ts">

const updated = '13 novembre 2025';

function handleSubmit() {
  // no-op: form intentionally does nothing
}

</script>
