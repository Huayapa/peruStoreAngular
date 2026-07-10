ARG NODE_VERSION=22.17-alpine

FROM node:${NODE_VERSION} AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

FROM base AS development

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]