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
- [Server Architecture](./documentation/server.md)

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

### Step 2: Start MongoDB with Docker

Before running the application, start the MongoDB container:

```bash
docker-compose up -d
```

To verify MongoDB is running, check the container status:

```bash
docker-compose ps
```

To stop MongoDB later:

```bash
docker-compose down
```

### Step 3: Start Development Servers

Run the development servers for both client and server:

```bash
pnpm dev
```

This will start:

- **Backend**: Running on `http://localhost:3000` (or configured port)
- **Frontend**: Running on `http://localhost:5173` (or configured port)

## Available Commands

Run these from the project root:

- `pnpm install` - Install all dependencies
- `pnpm dev` - Start development servers (server + client)
- `pnpm build` - Build all modules for production
- `pnpm lint` - Lint all modules for code quality issues
- `pnpm lint:fix` - Fix linting issues automatically

## Tech stack

- **Backend**: Express 5.x, TypeScript, Webpack
- **Frontend**: React 19.x, TypeScript, Webpack
- **Tooling**: pnpm workspaces, ESLint, Webpack, nodemon
