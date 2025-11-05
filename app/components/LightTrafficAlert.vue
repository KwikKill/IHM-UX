<template>
    <Card>
        <CardHeader class="px-0">
            <div class="mb-2 px-6">
                <CardTitle class="text-2xl font-bold">
                    Alertes trafic
                </CardTitle>
            </div>
            <Separator class="bg-border"/>
        </CardHeader>
        <CardContent>
            <div v-if="dataStore.trafficData.length > 0" class="grid grid-cols-4 gap-2">
                <div
                    v-for="alert in dataStore.trafficData"
                    :key="alert.idperturbation"
                    class="overflow-hidden bg-secondary text-background"
                >
                    <img :src="dataStore.getBusByLineId(alert.idligne)?.image.url" :alt="`Logo de la ligne ${alert.idligne}`" class="h-12 w-12 rounded-md object-contain mx-auto mt-4"/>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="dataStore.trafficData.length === 0" class="text-center py-12 text-muted-foreground">
                <p>No traffic alerts at this time</p>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Separator from './ui/separator/Separator.vue'

const dataStore = useDataStore()
console.log(dataStore)
</script>