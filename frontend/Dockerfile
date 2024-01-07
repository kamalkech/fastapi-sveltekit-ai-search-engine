FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

# Prod
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/build build/

COPY --from=builder /app/node_modules node_modules/

COPY package.json ./

EXPOSE 80

ENV NODE_ENV=production

# CMD [ "PORT=8080 node", "build" ]
CMD [ "sh", "-c", "PORT=80 node build" ]
