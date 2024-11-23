FROM node:18-alpine AS base

WORKDIR /app

COPY . .

RUN npm install & npm install -g typescript ts-node

EXPOSE 3000

CMD ["ts-node", "src/server.ts"]