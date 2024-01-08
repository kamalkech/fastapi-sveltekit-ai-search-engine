FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

# Prod
FROM node:18 AS production

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-cli -y

# RUN apt-get update && apt-get install -y curl apt-transport-https ca-certificates gnupg
# RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
# RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
# RUN apt-get update && apt-get install -y google-cloud-sdk

WORKDIR /app

COPY --from=builder /app/build build/

COPY --from=builder /app/node_modules node_modules/

COPY package.json ./

EXPOSE 80

ENV NODE_ENV=production

CMD [ "sh", "-c", "PORT=80 node build" ]
