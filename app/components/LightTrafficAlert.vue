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
            <Card v-for="alert in dataStore.trafficData" :key="alert.idperturbation" class="overflow-hidden bg-secondary text-background">
                Yes
            </Card>

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