# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY modules/client/package.json ./modules/client/
COPY modules/server/package.json ./modules/server/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json tsconfig.json ./
COPY modules/client ./modules/client

RUN pnpm --filter @kronos/client build
