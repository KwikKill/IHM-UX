<template>
    <div class="flex justify-center items-center min-h-screen bg-background">
        <Card class="w-full max-w-md p-6 flex flex-col gap-4">
            <CardHeader class="text-center">
                <CardTitle class="text-2xl font-semibold">
                    {{ mode === 'login' ? 'Connexion' : 'Inscription' }}
                </CardTitle>
                <p class="text-muted-foreground text-sm">
                    {{ mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte' }}
                </p>
            </CardHeader>

            <CardContent>
                <form class="flex flex-col gap-4" @submit.prevent="submit">
                    <!-- Username Input -->
                    <div class="flex flex-col gap-1">
                        <label for="username" class="text-sm font-medium text-foreground">Nom d'utilisateur</label>
                        <input
                            id="username"
                            v-model="username"
                            type="text"
                            placeholder="Renseignez votre nom d'utilisateur"
                            class="rounded-md border border-slate-700 bg-slate-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                    </div>

                    <!-- Password Input -->
                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-sm font-medium text-foreground">Mot de passe</label>
                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            placeholder="Renseignez votre mot de passe"
                            class="rounded-md border border-slate-700 bg-slate-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                    </div>

                    <!-- Confirm Password (only for register) -->
                    <div v-if="mode === 'register'" class="flex flex-col gap-1">
                        <label for="confirmPassword" class="text-sm font-medium text-foreground">
                            Confirmez le mot de passe
                        </label>
                        <input
                            id="confirmPassword"
                            v-model="confirmPassword"
                            type="password"
                            placeholder="Confirmez votre mot de passe"
                            class="rounded-md border border-slate-700 bg-slate-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                    </div>

                    <!-- Submit Button -->
                    <Button type="submit" class="w-full mt-2 cursor-pointer">
                        {{ mode === 'login' ? 'Se connecter' : "S'inscrire" }}
                    </Button>
                </form>
            </CardContent>

            <!-- Toggle Mode -->
            <p class="text-center text-sm text-muted-foreground mt-2">
                <span v-if="mode === 'login'">
                    Pas encore de compte ?
                    <button class="text-primary font-medium" @click="toggleMode">S'inscrire</button>
                </span>
                <span v-else>
                    Déjà un compte ?
                    <button class="text-primary font-medium" @click="toggleMode">Se connecter</button>
                </span>
            </p>

            <!-- Error Message -->
            <p v-if="error" class="text-red-500 text-center text-sm mt-2">
                {{ error }}
            </p>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'

const mode = ref<'login' | 'register'>('login')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const router = useRouter()
const userStore = useUserStore()

function toggleMode() {
    error.value = ''
    username.value = ''
    password.value = ''
    confirmPassword.value = ''
    mode.value = mode.value === 'login' ? 'register' : 'login'
}

function submit() {
    if (!username.value.trim() || !password.value) {
        error.value = 'Please fill in all fields.'
        return
    }

    if (mode.value === 'register' && password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.'
        return
    }

    // Fake login/register logic
    userStore.setLogedIn(true)
    userStore.setUsername(username.value)
    router.push('/')
}
</script>
