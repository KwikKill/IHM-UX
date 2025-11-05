<template>
  <Card class="p-4">
    <CardTitle>Favoris</CardTitle>
    <CardContent class="flex flex-col gap-1">
      <h2 class="font-semibold mt-2">Arrêts favoris</h2>
      <Card v-for="stopId in userStore.stopFavorites" :key="stopId" class="mb-2">
        <CardTitle>Arrêt {{ stopId }}</CardTitle>
        <CardContent>
          <button class="text-red-500 hover:underline" @click="userStore.removeStopFavorite(stopId)"><Icon name="material-symbols:close" size="1rem"/></button>
        </CardContent>
      </Card>
      <Card v-if="userStore.stopFavorites.length === 0">
        <CardContent>
          Vous n'avez pas encore ajouté d'arrêts favoris.
        </CardContent>
      </Card>

      <h2 class="font-semibold mt-4">Lignes favorites</h2>
      <Card v-for="lineId in userStore.lineFavorites" :key="lineId" class="mb-2">
        <CardContent class="flex justify-between">
          <div>Ligne {{ getDataFromId(lineId)?.nomcourtligne }}</div>
          <Button class="text-red-500 p-1 m-0" variant="destructive" @click="userStore.removeLineFavorite(lineId)"><Icon name="material-symbols:close" size="1rem"/></Button>
        </CardContent>
      </Card>
      <Card v-if="userStore.lineFavorites.length === 0">
        <CardContent>
          Vous n'avez pas encore ajouté de lignes favorites.
        </CardContent>
      </Card>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const dataStore = useDataStore()

const getDataFromId = (id: string) => {
  console.log("Searching for id:", id)
  console.dir(dataStore.busStops)
  return dataStore.busStops.find(stop => stop.idligne === id)
}

</script>