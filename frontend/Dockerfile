FROM node:18-alpine3.16 AS base

# Builder
FROM base AS builder
RUN apk add --no-cache sqlite
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma migrate deploy && \
    npx prisma generate
RUN npm run build
RUN npm prune --production

# Prod
FROM node:18 AS production
RUN apt-get update -y && apt-get install -y curl gnupg
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
    apt-get update -y && \
    apt-get install -y google-cloud-cli
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "sh", "-c", "PORT=3000 node build" ]
