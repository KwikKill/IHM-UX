import type { CSSProperties } from 'vue'

interface SpritePosition {
  x: number
  y: number
  width: number
  height: number
}

interface SpriteData {
  positions: Record<string, SpritePosition>
  spriteWidth: number
  spriteHeight: number
}

type SpriteMap = Record<string, SpritePosition>

// Cache for the sprite map and metadata
let spriteDataCache: SpriteData | null = null
let spriteMapPromise: Promise<SpriteData> | null = null

/**
 * Load the picto sprite map (only once, cached)
 */
async function loadSpriteMap(): Promise<SpriteData> {
  if (spriteDataCache) {
    return spriteDataCache
  }

  if (spriteMapPromise) {
    return spriteMapPromise
  }

  spriteMapPromise = fetch('/pictos-sprite.json')
    .then(res => res.json())
    .then(positions => {
      // Calculate sprite dimensions from positions
      let maxX = 0
      let maxY = 0
      for (const pos of Object.values(positions) as SpritePosition[]) {
        maxX = Math.max(maxX, pos.x + pos.width)
        maxY = Math.max(maxY, pos.y + pos.height)
      }
      
      spriteDataCache = {
        positions,
        spriteWidth: maxX,
        spriteHeight: maxY
      }
      return spriteDataCache
    })
    .catch(err => {
      console.error('Failed to load picto sprite map:', err)
      spriteMapPromise = null
      return { positions: {}, spriteWidth: 2048, spriteHeight: 398 }
    })

  return spriteMapPromise
}

export function usePictoSprite() {
  const spriteMap = ref<SpriteMap>({})
  const spriteWidth = ref(2048)
  const spriteHeight = ref(398)
  const isLoaded = ref(false)

  // Load sprite map on mount
  onMounted(async () => {
    const data = await loadSpriteMap()
    spriteMap.value = data.positions
    spriteWidth.value = data.spriteWidth
    spriteHeight.value = data.spriteHeight
    isLoaded.value = true
  })

  /**
   * Get CSS styles to display a specific picto from the sprite
   * @param idligne - The line ID (e.g., "0001", "0002")
   * @param size - Optional size in pixels (default: 28)
   * @returns CSS properties for background-image positioning
   */
  const getPictoStyle = (idligne: string, size: number = 28): CSSProperties => {
    const pos = spriteMap.value[idligne]
    
    if (!pos) {
      // Fallback: return empty style, component can handle missing picto
      return {}
    }

    // Calculate the scale factor to display this image at the desired size
    // We scale based on the larger dimension to maintain aspect ratio
    const scale = size / Math.max(pos.width, pos.height)

    return {
      backgroundImage: 'url(/pictos-sprite.png)',
      backgroundPosition: `-${pos.x * scale}px -${pos.y * scale}px`,
      backgroundSize: `${spriteWidth.value * scale}px ${spriteHeight.value * scale}px`,
      width: `${pos.width * scale}px`,
      height: `${pos.height * scale}px`,
      backgroundRepeat: 'no-repeat',
      display: 'inline-block',
    }
  }

  /**
   * Get optimized CSS styles with proper scaling (alternative approach)
   */
  const getPictoStyleOptimized = (idligne: string, size: number = 28): CSSProperties => {
    const pos = spriteMap.value[idligne]
    
    if (!pos) {
      return {}
    }

    // Scale factor based on desired size vs original size
    const scale = size / Math.max(pos.width, pos.height)
    
    return {
      backgroundImage: 'url(/pictos-sprite.png)',
      backgroundPosition: `-${pos.x * scale}px -${pos.y * scale}px`,
      backgroundSize: `${spriteWidth.value * scale}px auto`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundRepeat: 'no-repeat',
      display: 'inline-block',
    }
  }

  /**
   * Check if a picto exists in the sprite
   */
  const hasPicto = (idligne: string): boolean => {
    return !!spriteMap.value[idligne]
  }

  /**
   * Get fallback URL for when sprite is not available
   */
  const getFallbackUrl = (idligne: string): string => {
    return `/pictos/${idligne}.png`
  }

  return {
    isLoaded,
    getPictoStyle,
    getPictoStyleOptimized,
    hasPicto,
    getFallbackUrl,
    spriteMap: readonly(spriteMap)
  }
}
