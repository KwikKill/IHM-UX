<template>
  <div class="fixed inset-0 pointer-events-none z-[200000]">
    <div v-for="(c, i) in clicks" :key="i" :style="dotStyle(c) as any" class="rounded-full pointer-events-none" />
    <div class="fixed bottom-4 right-4 pointer-events-auto">
      <div class="bg-card p-2 rounded-md shadow-md">
        <div class="flex gap-2">
          <button class="btn" @click="download">Télécharger</button>
          <button class="btn-ghost" @click="clear">Effacer</button>
          <label class="ml-2 text-sm">
            <input type="checkbox" v-model="enabled" @change="toggleEnabled" /> Active feedback
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const clicks = ref<Array<{ x: number; y: number; w: number; h: number; ts: number; target?: string; path?: string }>>([])
const enabled = ref(false)

function load() {
  try {
    const raw = localStorage.getItem('userClicksUI')
    clicks.value = raw ? JSON.parse(raw) : []
  } catch { clicks.value = [] }
}

function toggleEnabled() {
  try {
    localStorage.setItem('feedbackEnabled', enabled.value ? 'true' : 'false')
    // notify same-tab listeners
    window.dispatchEvent(new CustomEvent('feedbackEnabled:change', { detail: enabled.value }))
  } catch {}
}

function onUpdate(e: any) {
  // same-tab update
  if (e && e.detail) {
    clicks.value.push(e.detail)
  }
}

function download() {
  try {
    const data = JSON.stringify(clicks.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user_clicks_ui_${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (err) { console.error(err) }
}

function clear() {
  clicks.value = []
  try { localStorage.removeItem('userClicksUI') } catch {}
}

onMounted(() => {
  load()
  try {
    const f = localStorage.getItem('feedbackEnabled')
    enabled.value = f === 'true'
  } catch {}
  window.addEventListener('userClicksUI:update', onUpdate as any)
  window.addEventListener('storage', load)
})

onUnmounted(() => {
  window.removeEventListener('userClicksUI:update', onUpdate as any)
  window.removeEventListener('storage', load)
})

function dotStyle(c: any) {
  const scaleX = window.innerWidth / (c.w || window.innerWidth || 1)
  const scaleY = window.innerHeight / (c.h || window.innerHeight || 1)
  const left = `${c.x * scaleX - 20}px`
  const top = `${c.y * scaleY - 20}px`
  return {
    position: 'absolute',
    left,
    top,
    width: '40px',
    height: '40px',
    background: 'radial-gradient(circle at center, rgba(255,59,48,0.18), rgba(255,59,48,0.02))',
    transform: 'translateZ(0)',
  }
}
</script>

<style scoped>
.btn { background:#111827; color: #fff; padding:6px 8px; border-radius:6px }
.btn-ghost { background:transparent; color:#111827; padding:6px 8px }
</style>
