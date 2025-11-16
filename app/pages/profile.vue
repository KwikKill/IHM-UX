<template>
  <main class="flex items-center justify-center min-h-screen p-6" role="main" aria-labelledby="profile-title">
    <div class="w-[92vw] md:w-[70vw]">
      <Card class="w-full p-8 rounded-lg shadow-md">
        <h1 id="profile-title" class="text-3xl font-semibold">Profil</h1>

        <div class="mt-4">
          <h2 class="text-lg font-medium">Nom d'utilisateur</h2>
          <p class="text-base mt-2">{{ userStore.username || 'Invité' }}</p>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-medium">Changer le mot de passe</h2>

          <form class="mt-3 space-y-3" aria-label="Changer le mot de passe" @submit.prevent="onChangePassword">
            <div>
              <label for="current" class="block text-sm font-medium">Mot de passe actuel</label>
              <input id="current" v-model="current" type="password" class="mt-1 block w-full border rounded-md p-2" autocomplete="current-password" >
            </div>

            <div>
              <label for="newpass" class="block text-sm font-medium">Nouveau mot de passe</label>
              <input id="newpass" v-model="newPass" type="password" class="mt-1 block w-full border rounded-md p-2" autocomplete="new-password" >
            </div>

            <div>
              <label for="confirm" class="block text-sm font-medium">Confirmer le nouveau mot de passe</label>
              <input id="confirm" v-model="confirmPass" type="password" class="mt-1 block w-full border rounded-md p-2" autocomplete="new-password" >
            </div>

            <div class="flex items-center justify-end gap-2">
              <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Mettre à jour</button>
            </div>
          </form>

          <div v-if="message" :class="messageClass" class="mt-3 p-2 rounded">
            {{ message }}
          </div>
        </div>

        <div class="mt-6">
          <Favorites />
        </div>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Favorites from '~/components/Favorites.vue'

const userStore = useUserStore()

const current = ref('')
const newPass = ref('')
const confirmPass = ref('')
const message = ref('')
const messageType = ref<'success'|'error'|''>('')

function onChangePassword() {
  message.value = ''
  messageType.value = ''

  if (!newPass.value) {
    messageType.value = 'error'
    message.value = 'Le nouveau mot de passe ne peut pas être vide.'
    return
  }

  if (newPass.value !== confirmPass.value) {
    messageType.value = 'error'
    message.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  // No-op: simulate success locally
  messageType.value = 'success'
  message.value = "Mot de passe mis à jour."
  current.value = ''
  newPass.value = ''
  confirmPass.value = ''
}

const messageClass = computed(() => {
  return messageType.value === 'success' ? 'bg-green-100 text-green-800' : messageType.value === 'error' ? 'bg-red-100 text-red-800' : ''
})
</script>
