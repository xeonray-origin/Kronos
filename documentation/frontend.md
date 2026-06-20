# Frontend — `@kronos/client`

React 19 SPA bundled with Webpack 5. Entry point: `src/main.tsx`. Output: `modules/client/dist/`.

## Stack

| Concern              | Library                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| UI framework         | React 19                                                                               |
| Styling              | Tailwind CSS v4 + CSS custom properties (OKLCH)                                        |
| Component primitives | Radix UI v1.6                                                                          |
| Variant management   | `class-variance-authority` (CVA)                                                       |
| Icons                | `lucide-react`                                                                         |
| Date utilities       | `date-fns`                                                                             |
| Class merging        | `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`                             |
| Bundler              | Webpack 5 + Babel (`@babel/preset-react` automatic runtime — no `import React` needed) |
| Type checking        | TypeScript (strict, `noUncheckedIndexedAccess`)                                        |
| Tests                | Jest 29 + `@testing-library/react` + jsdom                                             |

## Project structure

```
src/
├── App.tsx                  # Root: dark/light theme state, renders Topbar + active page
├── main.tsx                 # ReactDOM.createRoot entry point
├── global.css               # @theme tokens (oklch color space, light + .dark class dark mode)
├── lib/utils.ts             # cn() — clsx + tailwind-merge
├── components/
│   ├── base/                # Primitive UI (shadcn/Radix wrappers)
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx       # CVA variants: default | outline | secondary | ghost | destructive | link
│   │   ├── calendar.tsx
│   │   ├── card.tsx         # Card, CardContent, CardHeader, CardTitle, CardFooter, CardAction
│   │   ├── checkbox.tsx
│   │   ├── input.tsx
│   │   └── index.ts
│   ├── login-form/          # Email + password form with Google OAuth button
│   ├── signup-form/         # Name + email + password + confirm form with Google OAuth button
│   ├── sidebar/             # Nav links, project list, user avatar
│   ├── topbar/              # App name, task input, theme toggle
│   ├── task/                # Single task row (priority, labels, due date, progress, flag)
│   ├── task-list/           # Groups tasks by status: todo | in-progress | done
│   ├── timer/               # Pomodoro-style countdown timer
│   └── index.ts             # Barrel re-export of all feature components
├── pages/
│   ├── login.tsx            # Full-screen login page (wraps LoginForm)
│   ├── signup.tsx           # Full-screen signup page (wraps SignupForm)
│   ├── app-layout.tsx       # Dashboard: Sidebar + TaskList + Timer
│   └── index.ts
└── __mocks__/
    └── styleMock.js         # CSS stub for Jest
```

## Theme system

`global.css` defines all design tokens as CSS custom properties under `:root` (light) and `.dark`. `App.tsx` holds the `isDark` boolean and toggles the `.dark` class on the root `<div>`. Colors use the OKLCH color space. The brand color is `--brand: oklch(0.62 0.17 28)` (orange).

## Component conventions

- **Base components** wrap Radix UI primitives with Tailwind classes and `data-slot` attributes. `Button` uses CVA for `variant` and `size` props.
- **Feature components** compose base components with domain logic. They are named exports (not default).
- **Pages** are default exports and serve as route-level containers.
- All barrels re-export through `components/index.ts` and `pages/index.ts`.

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

### `LoginForm` / `SignupForm`

Uncontrolled form components managing their own state. No submission handler yet — API integration is pending.

`SignupForm` fields: full name · email · password (toggle) · confirm password (toggle).

## Testing

- Test files: `src/**/__tests__/**/*.spec.tsx` — never `.test.ts`
- Runner: `jest --config jest.config.cjs`
- CSS imports are stubbed via `moduleNameMapper` → `src/__mocks__/styleMock.js`
- Path alias `@/` maps to `src/` in both `tsconfig.json` and `jest.config.cjs`
- Coverage target: 100% statements, branches, functions, lines

```bash
pnpm test              # run all tests
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage report
pnpm typecheck         # tsc --noEmit
```
