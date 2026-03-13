FROM node:lts-slim

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

RUN pnpm run build

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]