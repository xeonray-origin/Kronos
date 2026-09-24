# Frontend — `@kronos/client`

React 19 single-page application bundled with Webpack 5. Entry point: `src/main.tsx`. Build output: `modules/client/dist/`.

## Stack

| Concern              | Library                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| UI framework         | React 19                                                                               |
| Routing              | `react-router` v8 (`BrowserRouter`, `Routes`/`Route`, layout routes with `Outlet`)     |
| State management     | Redux Toolkit (`@reduxjs/toolkit`) + `react-redux`                                     |
| HTTP client          | `axios` — single configured instance in `src/api/client.ts`                            |
| Styling              | Tailwind CSS v4 + CSS custom properties (OKLCH)                                        |
| Component primitives | Radix UI (`radix-ui` v1.6)                                                             |
| Variant management   | `class-variance-authority` (CVA)                                                       |
| Icons                | `lucide-react`                                                                         |
| Date utilities       | `date-fns`, `react-day-picker`                                                         |
| Class merging        | `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`                             |
| Bundler              | Webpack 5 + Babel (`@babel/preset-react` automatic runtime — no `import React` needed) |
| Type checking        | TypeScript (strict, `noUncheckedIndexedAccess`)                                        |
| Tests                | Jest 29 + `@testing-library/react` + jsdom                                             |

## Architecture at a glance

The client is organised into horizontal layers. Data flows **down** (server → store → hooks → components) and intents flow **up** (component → hook → store/api → server).

```
┌────────────────────────────────────────────────────────────────┐
│  main.tsx        BrowserRouter → Redux Provider → App           │
├────────────────────────────────────────────────────────────────┤
│  App.tsx         theme state · Topbar · CreateTaskModal          │
├────────────────────────────────────────────────────────────────┤
│  routes/         route table + session guards (AppRoutes)        │
├────────────────────────────────────────────────────────────────┤
│  layouts/        route-level containers (AuthLayout, AppLayout)  │
├────────────────────────────────────────────────────────────────┤
│  components/     base/ (UI primitives) + feature components      │
├────────────────────────────────────────────────────────────────┤
│  hooks/          orchestration (useTasks) — store ⇄ api glue     │
├────────────────────────────────────────────────────────────────┤
│  store/          Redux Toolkit slices + reducers + typed hooks   │
├────────────────────────────────────────────────────────────────┤
│  api/            axios client + per-domain request modules       │
└────────────────────────────────────────────────────────────────┘
```

The guiding rule: **components stay presentational, hooks own orchestration, the store owns state, and `api/` owns transport.** A component never calls `axios` or dispatches a multi-step async sequence directly — it calls a hook.

## Project structure

```
src/
├── main.tsx                # Mounts BrowserRouter → <Provider store> → <App>
├── App.tsx                 # Theme (isDark) state, Topbar, CreateTaskModal, <AppRoutes>
├── global.css              # @theme tokens (oklch, light + .dark class dark mode)
├── global.d.ts             # window.React declaration (module file)
├── css.d.ts                # Ambient `declare module '*.css'` (script file — no imports)
├── lib/utils.ts            # cn() — clsx + tailwind-merge
│
├── routes/
│   ├── app-routes.tsx      # Route table wrapped in SessionGuard + route guards
│   └── index.ts            # Barrel: { AppRoutes }
│
├── api/                    # Transport layer
│   ├── client.ts           # Configured axios instance + auth/refresh interceptors
│   ├── auth.api.ts         # initateLogin, refreshSession
│   ├── task.api.ts         # Task endpoints (getTasks, …) — return parsed data
│   └── index.ts            # Barrel: { client, taskApi, authApi }
│
├── store/                  # Redux Toolkit state
│   ├── store.ts            # configureStore, RootState/AppDispatch, typed hooks
│   ├── index.ts            # Barrel: store, typed hooks, authActions, taskActions
│   ├── slice/
│   │   ├── auth.slice.ts   # createSlice(name: 'auth') using authReducer map
│   │   ├── task.slice.ts   # createSlice(name: 'tasks') using taskReducer map
│   │   └── index.ts
│   └── reducer/            # Reducer maps passed into each slice
│       ├── auth.reducer.ts # setToken, clearToken
│       ├── task.reducer.ts # setTasks, addTask, setStatus
│       └── index.ts
│
├── hooks/
│   └── useTasks.ts         # Selects task state + exposes fetchTasks() (api → dispatch)
│
├── layouts/                # Route-level containers
│   ├── authentication.tsx  # AuthLayout — toggles LoginForm / SignupForm
│   ├── app.tsx             # AppLayout — Sidebar + TaskList + Timer, calls useTasks
│   └── index.ts            # Barrel: { AppLayout, AuthLayout }
│
├── components/
│   ├── base/               # Primitive UI (shadcn/Radix wrappers)
│   │   ├── alert.tsx  avatar.tsx  badge.tsx  button.tsx  calendar.tsx
│   │   ├── card.tsx  checkbox.tsx  dialog.tsx  input.tsx
│   │   └── index.ts
│   ├── session/            # SessionGuard, ProtectedRoute, PublicRoute
│   ├── login-form/         # Email + password form, wired to authApi.initateLogin
│   ├── signup-form/        # Name + email + password + confirm form (not yet wired)
│   ├── sidebar/            # Nav links, project list, user avatar
│   ├── topbar/             # App name, task input, theme toggle, add-task trigger
│   ├── task/               # Single task row (priority, labels, due date, progress, flag)
│   ├── task-list/          # Groups tasks by status: todo | in-progress | done
│   ├── create-task-modal/  # Dialog-based form for creating a task
│   ├── timer/              # Pomodoro-style countdown timer
│   └── index.ts            # Barrel re-export of all feature components
│
├── types/
│   ├── task.types.ts       # ITask domain interface
│   ├── auth.types.ts       # IAuthPayload, ILoginResponse, IRefreshResponse
│   ├── store.types.ts      # IAuthState, ITasksState
│   ├── component.types.ts  # Shared component prop types
│   └── index.ts
│
└── __mocks__/
    ├── styleMock.js        # CSS stub for Jest
    └── reactRouterMock.tsx # react-router stub for Jest
```

> Tests live in `src/__tests__/**` mirroring `src/` (e.g. `store/auth.slice.spec.ts`,
> `api/client.spec.ts`, `hooks/useTasks.spec.ts`), with a few co-located exceptions such as
> `components/topbar/__tests__/topbar.spec.tsx` and `components/session/__tests__/*.spec.tsx`.

## Routing & session guards

`main.tsx` wraps the app in `BrowserRouter`; `App.tsx` renders `<AppRoutes>` from `routes/app-routes.tsx`. The route table nests every route inside `SessionGuard`, then splits public and protected branches:

```tsx
<Routes>
  <Route element={<SessionGuard />}>
    <Route element={<PublicRoute />}>
      <Route path="/" element={<AuthLayout />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<AppLayout />} />
    </Route>
  </Route>
</Routes>
```

| Path         | Element      | Guard            | Purpose                          |
| ------------ | ------------ | ---------------- | -------------------------------- |
| `/`          | `AuthLayout` | `PublicRoute`    | Login / signup (toggle in-place) |
| `/dashboard` | `AppLayout`  | `ProtectedRoute` | Sidebar + TaskList + Timer       |

The guards (`components/session/`) each render an `Outlet` or redirect:

- **`SessionGuard`** — on first mount with no token, silently calls `authApi.refreshSession()` (the refresh cookie is sent automatically) and stores the returned token. Renders a loading state while checking, then the `Outlet`. Runs once per mount; a failed refresh simply leaves the user logged out.
- **`PublicRoute`** — redirects logged-in users to `/dashboard`.
- **`ProtectedRoute`** — redirects logged-out users to `/`.

`Topbar` and `CreateTaskModal` render **outside** the route table in `App.tsx`, so they persist across route changes. To add a route: create the container in `layouts/`, register a `<Route>` in `routes/app-routes.tsx` under the appropriate guard.

## State management (Redux Toolkit)

State lives in two feature slices combined in `store/store.ts`:

```
rootReducer = { auth, tasks }
```

- **`auth`** (`IAuthState`): `isLoggedIn`, `token`, `user`, `status`, `error`.
  Reducers: `setToken` (also sets `isLoggedIn: true`), `clearToken` (resets token, login flag, user, and status).
- **`tasks`** (`ITasksState`): `items: ITask[]`, `status: 'idle' | 'loading' | 'error'`, `error`.
  Reducers: `setTasks`, `addTask`, `setStatus`.

**Convention — reducers live in `store/reducer/`, not inline in the slice.** Each slice imports a plain reducer map (`reducers: taskReducer`) from `store/reducer/`. This keeps slices thin and reducers individually testable. Reducers are written as pure functions returning a new state object (`return { ...state, … }`) rather than mutating Immer drafts.

**Always use the typed hooks** from `store/store.ts` — never the raw `react-redux` ones:

```ts
import { useAppDispatch, useAppSelector } from '@/store';

const dispatch = useAppDispatch();
const tasks = useAppSelector((s) => s.tasks.items);
```

Action creators are re-exported as namespaced bundles from `@/store` (`authActions`, `taskActions`), so call sites read as `dispatch(taskActions.setTasks(...))`.

## API layer

`api/client.ts` exports a single configured axios instance (`baseURL: http://localhost:8080`, `withCredentials: true`) with two interceptors:

- **Request** — reads `store.getState().auth.token` and, when present, sets the `Authorization: Bearer` header.
- **Response** — on a `401`, calls `GET /auth/refresh`, stores the new token via `authActions.setToken`, and **replays the original request once** (a `_retry` flag prevents loops, and the refresh endpoint itself is never retried). If the refresh fails, the interceptor dispatches `authActions.clearToken` and rethrows.

Per-domain modules import this client and expose functions that return the **parsed response data**, not the axios response:

- **`auth.api.ts`** — `initateLogin(payload)` posts to `/auth/login`; `refreshSession()` gets `/auth/refresh`.
- **`task.api.ts`** — `getTasks()` and friends:

```ts
export const getTasks = () => client.get<ITask[]>('/task').then((r) => r.data);
```

Components and layouts never import `client` directly — they go through a hook (or, for the session components, the `authApi` module).

## Data flow (worked example: loading tasks)

```
AppLayout (useEffect)                          ── mount
  → useTasks().fetchTasks()                    ── hooks/useTasks.ts
      → dispatch(taskActions.setStatus('loading'))
      → taskApi.getTasks()                     ── api/task.api.ts
          → client.get('/task')                ── api/client.ts (adds auth header)
      → dispatch(taskActions.setTasks(res))
      → dispatch(taskActions.setStatus('idle'))
  → useAppSelector(s => s.tasks.items)         ── re-render with data
  → tasks.map(toTaskListItem) → <TaskList>
```

`toTaskListItem` in `layouts/app.tsx` adapts the server `ITask` into the view model `TaskListItem` that presentational components expect (status grouping, flag colour, etc.). This adapter boundary keeps the API shape decoupled from component props.

### Login flow

```
LoginForm (Sign in)
  → authApi.initateLogin({ email, password })   ── POST /auth/login (sets refresh cookie)
  → dispatch(authActions.setToken(token))       ── isLoggedIn: true
  → navigate('/dashboard')                      ── ProtectedRoute now passes
```

On a full page reload, `SessionGuard` restores the session from the refresh cookie before rendering any route.

## Theme system

`global.css` defines all design tokens as CSS custom properties under `:root` (light) and `.dark`, in the OKLCH color space. `App.tsx` holds the `isDark` boolean and toggles the `.dark` class on the root `<div>`; `Topbar` exposes the toggle via `onToggleTheme`. The brand color is `--brand: oklch(0.62 0.17 28)` (orange).

## Component conventions

- **Base components** (`components/base/`) wrap Radix UI primitives with Tailwind classes and `data-slot` attributes. `Button` uses CVA for `variant` and `size`. Barrel-exported from `components/base/index.ts`.
- **Feature components** compose base components with domain logic. They are **named exports**, barrel-exported from `components/index.ts`.
- **Layouts** are **default exports** and serve as route-level containers; the barrel renames `AuthenticationLayout → AuthLayout`.
- **Forms** (`LoginForm`, `SignupForm`, `CreateTaskModal`) are controlled by local `useState`. `LoginForm` is wired to `authApi.initateLogin`; `SignupForm` has **no submission handler yet** — wiring it to a register endpoint is the natural next integration point.

## Key component props

### `Topbar`

| Prop            | Type                       | Default           |
| --------------- | -------------------------- | ----------------- |
| `appName`       | `string`                   | `'Tempo'`         |
| `placeholder`   | `string`                   | `'Add a task...'` |
| `onAddTask`     | `() => void`               | —                 |
| `onToggleTheme` | `(value: boolean) => void` | required          |
| `isDark`        | `boolean`                  | `true`            |

### `Sidebar`

| Prop       | Type                                   | Default               |
| ---------- | -------------------------------------- | --------------------- |
| `user`     | `{ name: string; avatarUrl?: string }` | `{ name: 'Xeonray' }` |
| `links`    | `NavLink[]`                            | built-in nav items    |
| `projects` | `Project[]`                            | built-in project list |

### `TaskList`

Accepts `tasks: TaskListItem[]` and groups them into **To Do**, **In Progress**, and **Done** sections. Empty groups are hidden. Returns `null` when all groups are empty.

### `Task`

| Prop               | Type                                    | Notes                                        |
| ------------------ | --------------------------------------- | -------------------------------------------- |
| `title`            | `string`                                | required                                     |
| `priority`         | `'none' \| 'low' \| 'medium' \| 'high'` | colours the completion ring                  |
| `completed`        | `boolean`                               | strikes through title, fills ring green      |
| `progress`         | `{ filled: number; total: number }`     | dot-pip progress indicator                   |
| `labels` / `label` | `string[]` / `string`                   | rendered as secondary badges                 |
| `dueDate`          | `string`                                | red when not muted, grey when `dueDateMuted` |
| `flagColor`        | `'orange' \| 'blue' \| 'gray'`          | flag icon tint                               |
| `showTimer`        | `boolean`                               | shows clock icon                             |

### `CreateTaskModal`

| Prop       | Type                      | Notes                                  |
| ---------- | ------------------------- | -------------------------------------- |
| `open`     | `boolean`                 | controls the Radix `Dialog`            |
| `onClose`  | `() => void`              | resets form + closes                   |
| `onSubmit` | `(task: NewTask) => void` | fires on valid submit (title required) |

`NewTask` = `{ title; description?; dueDate?; project? }`. Submission is gated on a non-empty trimmed `title`.

### `LoginForm` / `SignupForm`

Controlled form components managing their own `useState`. `LoginForm` submits via `authApi.initateLogin`, stores the token, and navigates to `/dashboard`. `SignupForm` (full name · email · password · confirm password, with visibility toggles) is not yet wired to the API.

## How to contribute

Pick the layer that matches the change and follow its established pattern:

- **Add a new screen/route** → create a container in `layouts/`, export it from `layouts/index.ts`, and register a `<Route>` in `routes/app-routes.tsx` under `PublicRoute` or `ProtectedRoute` as appropriate.
- **Add a new server resource (e.g. projects)**:
  1. Add the domain type in `types/`.
  2. Add an `api/<domain>.api.ts` module that uses `client` and returns parsed data; export it from `api/index.ts`.
  3. Add a slice in `store/slice/` + a reducer map in `store/reducer/`; wire it into `rootReducer`.
  4. Add a `hooks/use<Domain>.ts` that selects state and exposes async actions.
  5. Consume the hook from a layout/component — **never call axios or dispatch sequences from a component**.
- **Add UI** → reuse `components/base/`; only add a new base primitive if Radix offers one and it's genuinely reusable. Feature components are named exports via `components/index.ts`.
- **Touch state** → reducers go in `store/reducer/` as pure functions; access state only through the typed `useAppSelector` / `useAppDispatch` hooks and namespaced `*Actions`.

### House rules

- **No comments** unless the _why_ is non-obvious. Names are the documentation.
- Use the `@/` path alias (maps to `src/`) for cross-directory imports.
- Every directory exposes a barrel (`index.ts`); import from the barrel, not deep paths.
- Keep components presentational; push fetching/orchestration into hooks.

## Testing

- Test files: `*.spec.ts` / `*.spec.tsx` — **never `.test.ts`**.
- Most tests live under `src/__tests__/**` mirroring `src/`; a few are co-located in `__tests__/` next to the component (`topbar`, `session`).
- Runner: `jest --config jest.config.cjs`.
- `moduleNameMapper` stubs CSS imports (`src/__mocks__/styleMock.js`) and `react-router` (`src/__mocks__/reactRouterMock.tsx`), and maps the `@/` alias to `src/`.
- Coverage target: **100%** statements, branches, functions, lines. Write the **minimum** cases to hit it, and always include an error/rejection case for any path that can throw (e.g. the 401-refresh branch in `api/client.ts`).

```bash
pnpm test              # run all tests
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage report
pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint .
pnpm dev               # webpack-dev-server
pnpm build             # production build → dist/
```
