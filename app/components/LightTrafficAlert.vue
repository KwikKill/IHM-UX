<template>
    <Card class="flex-1">
        <CardHeader class="px-0">
            <div class="mb-2 px-6">
                <CardTitle class="text-2xl font-bold">
                    Alertes trafic
                </CardTitle>
            </div>
            <Separator class="bg-border" />
        </CardHeader>
        <CardContent>
            <div v-if="dataStore.trafficData.length > 0" class="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-3 gap-2">
                <NuxtLink
                    v-for="alert in getData()"
                    :key="alert.idperturbation"
                    class="flex justify-center items-center"
                    :to="`${alert.url}`"
                    target="_blank"
                    noopener
                    noreferrer
                >
                    <div
                        class="relative"
                    >
                        <img
                            :src="`/pictos/${alert.idligne}.png`"
                            :alt="`Logo ligne ${alert.nomcourtligne}`" class="rounded-md object-contain"
                        >
                        <div
                            class="absolute top-0 right-0 text-white text-xs font-bold rounded-full 2xl:size-5 md:size-3 size-5 flex items-center justify-center"
                            :class="{
                                'bg-red-600': alert.niveau.includes('Majeure'),
                                'bg-orange-500': alert.niveau.includes('Bloquante') && !alert.niveau.includes('Majeure'),
                                'bg-green-500': alert.niveau.includes('Mineure') && !alert.niveau.includes('Majeure') && !alert.niveau.includes('Bloquante'),
                            }"
                        />
                    </div>
                    
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 text-muted-foreground">
                <p>No traffic alerts at this time</p>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Separator from './ui/separator/Separator.vue'

const dataStore = useDataStore()
const getData = () => {
    const niveauOrder = ['Majeure','Bloquante','Mineure']
    const map = new Map()
    for (const a of dataStore.trafficData) {
        let idx = niveauOrder.findIndex(n => a.niveau.includes(n))
        if (idx === -1) idx = niveauOrder.length
        const key = a.idligne
        if (!map.has(key) || idx < map.get(key).idx) {
            map.set(key, { alert: a, idx })
        }
    }
    return Array.from(map.values()).map(v => v.alert).sort((a, b) => {
        const aIndex = niveauOrder.findIndex(n => a.niveau.includes(n))
        const bIndex = niveauOrder.findIndex(n => b.niveau.includes(n))
        return aIndex - bIndex
    })
}

</script>