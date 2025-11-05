<template>
    <div class="grid grid-cols-5 gap-4 p-3">
        <LightTrafficAlert />
        <div class="col-span-3 flex flex-col gap-4">
            <Card>
                <div class="text-center text-muted-foreground">
                    <p>Bar de recherche</p>
                </div>
            </Card>
            <Card class="flex-1">
                <div class="text-center py-12 text-muted-foreground">
                    <p>Liste des bus</p>
                </div>
            </Card>
        </div>
        <Card>
            <div class="text-center py-12 text-muted-foreground">
                <p>Filtres</p>
            </div>
        </Card>
    </div>
</template>