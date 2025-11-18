<template>
  <div class="p-4 space-y-4">
    <!-- App introduction -->
    <Card>
      <CardHeader>
        <CardTitle>Bienvenue sur l'application Swish !</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-4">
          Swish est une application dédiée aux transports en commun de Rennes. Elle vous permet de consulter les horaires en temps réel, de visualiser les perturbations du trafic, et de planifier vos trajets facilement.
        </p>
      </CardContent>
    </Card>

    <!-- Traffic Alert and favorites -->
    <div class="grid md:grid-cols-2 gap-4">
      <TrafficAlert />
      <Favorites />
    </div>
  </div>
</template>
