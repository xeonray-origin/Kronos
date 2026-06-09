# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm

# Copy only the files needed for dependency installation (layer-cache friendly)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY modules/server/package.json ./modules/server/
COPY modules/client/package.json ./modules/client/

RUN pnpm install --frozen-lockfile

# Copy source and shared TS config, then build
COPY tsconfig.base.json tsconfig.json ./
COPY modules/server ./modules/server

RUN pnpm --filter @kronos/server build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
RUN corepack enable pnpm

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY modules/server/package.json ./modules/server/
COPY modules/client/package.json ./modules/client/

RUN pnpm install --filter @kronos/server --prod --frozen-lockfile

COPY --from=builder /app/modules/server/dist ./modules/server/dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "modules/server/dist/index.js"]