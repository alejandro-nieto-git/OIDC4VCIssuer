FROM node:18-alpine AS base

WORKDIR /app


COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g typescript@5.4.5 ts-node

COPY . .

EXPOSE 9000

CMD ["ts-node", "src/server.ts"]
# CMD ["sh", "-c", "while true; do sleep 30; done"]
