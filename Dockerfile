FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=build /app/.output /app/

ENV PORT=80
ENV HOST=0.0.0.0
EXPOSE 80

CMD ["node", "/app/server/index.mjs"]

