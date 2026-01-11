<template>
  <div
    v-if="useSprite && isLoaded && hasPicto(idligne)"
    :style="getPictoStyle(idligne, size)"
    :class="className"
    :title="alt"
  />
  <img
    v-else
    :src="`/pictos/${idligne}.png`"
    :alt="alt"
    :class="className"
    @error="onError"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    idligne: string
    size?: number
    alt?: string
    className?: string
    useSprite?: boolean
  }>(),
  {
    size: 32,
    alt: 'Picto de ligne',
    className: '',
    useSprite: true
  }
)

const { isLoaded, getPictoStyle, hasPicto } = usePictoSprite()

const onError = (e: Event) => {
  // Hide image on error
  const target = e.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}
</script>
