<template>
  <Card class="p-4 flex-1">
    <CardTitle>Favoris</CardTitle>
    <CardContent class="flex flex-col gap-1">
      <h2 class="font-semibold mt-2">Arrêts favoris</h2>
      <Card v-for="stopId in userStore.stopFavorites" :key="stopId" class="mb-2">
        <CardContent class="flex justify-between">
          <div>Arrêt {{ dataStore.getStopById(stopId)?.nom }}</div>
          <Button class="text-red-500 p-1 m-0 cursor-pointer" variant="destructive" @click="userStore.removeStopFavorite(stopId)"><Icon name="material-symbols:close" size="1rem"/></Button>
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
          <div>Ligne {{ dataStore.getBusByLineId(lineId)?.nomcourtligne }}</div>
          <Button class="text-red-500 p-1 m-0 cursor-pointer" variant="destructive" @click="userStore.removeLineFavorite(lineId)"><Icon name="material-symbols:close" size="1rem"/></Button>
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



</script>