<span>
  <img src="./documentation/assets/hero.jpg" height="360px" />
<span>

# Kronos

Kronos is a high-performance, power-user task management application built on the MERN stack. Designed for developers and productivity enthusiasts, it bridges the gap between agile project management and deep-work execution by combining a fluid Kanban interface, keyboard-driven command parsing, and integrated focus tracking.

Detailed summary of the app idea: [click here](./documentation/idea.md)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Installation Guide](#docker-installation-guide)
- [Pnpm Installation Guide](#pnpm-installation-guide)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Tech Stack](#tech-stack)
- [JWT Token Logic](./documentation/jwt-token-logic.md)
- [Server Architecture](./documentation/server.md)
- [Frontend Architecture](./documentation/frontend.md)

## Prerequisites

- Node.js 22+
- pnpm 10.15.0+
- Locally installed docker

## Docker installation guide

To install Docker, download and run the installer for your operating system from the official Docker website. After installation, verify it by running `docker --version` in a terminal. For detailed setup instructions, see the Docker docs:

- https://docs.docker.com/get-docker/

## Pnpm installation guide

If your Node.js includes Corepack (Node 16.14+ / recommended Node 22+), enable it and install/activate pnpm with:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Verify with `pnpm --version`.

See the pnpm installation docs for more details: https://pnpm.io/installation

## Getting Started

### Step 1: Install Dependencies

From the project root, run:

```bash
pnpm install
```

### Step 2: Configure environment variables

Copy the example env files (the defaults match the Docker MongoDB credentials below):

```bash
cp modules/server/.env.example modules/server/.env
cp modules/client/.env.example modules/client/.env
```

In production the server refuses to start unless `MONGODB_URI`, `JWT_SECRET` and `JWT_REFRESH_SECRET` are set. Client variables are inlined into the browser bundle, so never put secrets in `modules/client/.env`.

### Step 3: Start MongoDB with Docker

Before running the application, start the MongoDB container:

```bash
pnpm db:up
```

To verify MongoDB is running, check the container status:

```bash
docker compose ps
```

To stop MongoDB later:

```bash
pnpm db:down
```

### Step 4: Start Development Servers

The client and server are started separately, each in its own terminal:

```bash
pnpm dev:server
pnpm dev:client
```

This will start:

- **Backend**: `http://localhost:8080` (override with `PORT`; API under `/api`, health check at `/health-check`)
- **Frontend**: `http://localhost:3000`

## Available Commands

Run these from the project root:

- `pnpm install` - Install all dependencies
- `pnpm dev:server` / `pnpm dev:client` - Start the server / client in development mode
- `pnpm build:client` - Build the client for production
- `pnpm --filter @kronos/server build` - Build the server for production (the root `build:server` script currently points at the client)
- `pnpm typecheck` - Type-check the whole workspace
- `pnpm lint` / `pnpm lint:fix` - Lint (and auto-fix) the codebase
- `pnpm format` / `pnpm format:check` - Format / check formatting with Prettier
- `pnpm test:server` - Run server tests
- `pnpm --filter @kronos/client test` - Run client tests (the root `test:client` script currently points at the server)
- `pnpm db:up` / `pnpm db:down` / `pnpm db:logs` - Start, stop, and tail logs of the MongoDB container

Commits are checked by Husky hooks: the pre-commit hook runs typecheck, formatting and tests, and commit messages must follow `type(scope): subject` with type `feat`, `fix`, `test` or `chore`.

## Tech stack

- **Backend**: Express 5.x, TypeScript, MongoDB (Mongoose), Zod, Webpack
- **Frontend**: React 19.x, TypeScript, Redux Toolkit, Tailwind CSS 4, Radix UI, Webpack
- **Tooling**: pnpm workspaces, ESLint, Prettier, Jest, Husky, commitlint, nodemon
