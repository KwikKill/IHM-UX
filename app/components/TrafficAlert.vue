<template>
  <div class="space-y-4 border rounded-lg p-4 bg-secondary shadow">
    <Card 
      v-for="alert in alerts" 
      :key="alert.id"
      class="overflow-hidden bg-card text-card-foreground"
    >
      <CardHeader class="pb-3">
        <div class="flex items-start gap-4">
          <!-- Bus Line Logo -->
          <div class="flex-shrink-0">
            <img 
              :src="alert.busLineLogo" 
              :alt="`${alert.busLine} logo`"
              class="h-12 w-12 rounded-md object-contain"
            >
          </div>
          
          <!-- Reason and Time -->
          <div class="flex-1 min-w-0">
            <CardTitle class="text-lg font-semibold mb-1">
              {{ alert.reason }}
            </CardTitle>
            <p class="text-sm text-muted-foreground">
              {{ formatTime(alert.timestamp) }}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p class="text-sm leading-relaxed">
          {{ alert.message }}
        </p>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <div 
      v-if="alerts.length === 0" 
      class="text-center py-12 text-muted-foreground"
    >
      <p>No traffic alerts at this time</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the alert interface
interface BusAlert {
  id: string | number
  busLine: string
  busLineLogo: string
  reason: string
  timestamp: string | Date
  message: string
}

// Import your store (adjust the path as needed)
// Example: import { useAlertStore } from '~/stores/alertStore'
// const alertStore = useAlertStore()

const alerts = computed<BusAlert[]>(() => [
  {
    id: 1,
    busLine: 'C1',
    busLineLogo: '/images/line-a-logo.png',
    reason: 'Delai',
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    message: 'Le bus C1 est retardé de 15 minutes en raison de la circulation dense sur son itinéraire.'
  },
  {
    id: 2,
    busLine: 'C4',
    busLineLogo: '/images/line-b-logo.png',
    reason: 'Interruption de service',
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    message: 'Le C4 est ENCORE interrompu parce que.'
  },
  {
    id: 3,
    busLine: 'C2',
    busLineLogo: '/images/line-c-logo.png',
    reason: 'Travaux',
    timestamp: new Date(Date.now() - 3 * 86400000), // 3 days ago
    message: 'Des travaux de voirie affectent le service du C2 jusqu\'au 30 juin. Des itinéraires alternatifs sont en place.'
  },
  {
    id: 4,
    busLine: 'C3',
    busLineLogo: '/images/line-d-logo.png',
    reason: 'Accident',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    message: 'Un accident impliquant un véhicule a bloqué la route principale empruntée par le C3, causant des retards importants.'
  },
  {
    id: 5,
    busLine: '14',
    busLineLogo: '/images/line-e-logo.png',
    reason: 'Conditions météorologiques',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    message: 'En raison de fortes pluies, le service du 14 est ralenti. Veuillez prévoir des temps de trajet supplémentaires.'
  }
])

// Or get from store:
// const alerts = computed(() => alertStore.alerts)


// Format timestamp
const formatTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffMins < 1) return 'Maintenant'
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins !== 1 ? 's' : ''}`
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours !== 1 ? 's' : ''} `
  
  return date.toLocaleDateString('fr-FR', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>