# IHM-UX

This repo contains an application that uses the Rennes Metropole API to show data related to public transport, such as traffic alerts, a map view, search and favorites. It uses Nuxt, Vue 3, Pinia for state and Tailwind CSS for styling.

Some components come from shadcn-vue.

## Features

- View traffic alerts and light-traffic alerts
- Interactive map page
- Search and Favorites pages
- Simple profile page

# Prerequisites

- Node.js 18+ (Nuxt 3 recommends Node 18+)
- `npm` (or `pnpm` / `yarn` — adjust commands if you use them)

# Quick start

## Install dependencies:

```bash
npm install
```

## Start the development server (hot-reload):

```bash
npm run dev
```

## Build for production:

```bash
npm run build
```

## Preview the production build locally:

```bash
npm run preview
```

## Project layout: 

- `app/` — Nuxt app (pages, components, assets)
- `app/pages/` — route pages (index, map, profile, search, etc.)
- `app/components/` — reusable UI components
- `app/stores/` — Pinia stores
- `public/` — static assets
