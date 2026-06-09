# Kronos

Kronos is a high-performance, power-user task management application built on the MERN stack. Designed for developers and productivity enthusiasts, it bridges the gap between agile project management and deep-work execution by combining a fluid Kanban interface, keyboard-driven command parsing, and integrated focus tracking.

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

## Scripts

### Run thes commands for project root.

- `pnpm install` - Install all dependencies
- `pnpm dev` - Start dev servers (server + client)
- `pnpm build` - Build all modules
- `pnpm lint` - Lint all modules
- `pnpm lint:fix` - Fix linting issues

## Tech stack

- **Backend**: Express 5.x, TypeScript, Webpack
- **Frontend**: React 19.x, TypeScript, Webpack
- **Tooling**: pnpm workspaces, ESLint, Webpack, nodemon
