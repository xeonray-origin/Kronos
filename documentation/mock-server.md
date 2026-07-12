# Mock Server — `@kronos/client`

The client ships with an in-browser mock API built on [MSW (Mock Service Worker)](https://mswjs.io/). It intercepts outgoing `fetch`/XHR requests at the Service Worker layer and answers them with canned responses, so the SPA can run **without a live `@kronos/server`** during development.

Because MSW patches the network at the browser boundary, the app's `axios` client (`api/client.ts`) is untouched — it makes the same requests it would in production and never knows the responses are mocked.

## Files

```
src/mock-server/
├── handlers.ts        # Request handlers — one per mocked endpoint
├── browser.ts         # setupWorker(...handlers) → exports `worker`
└── data/
    └── tasks.json     # Static mock payloads, imported by handlers

public/
└── mockServiceWorker.js   # Generated MSW worker script (do not edit by hand)
```

- **`handlers.ts`** — the array of `http.*` handlers. This is the file you edit to add or change mocked scenarios.
- **`browser.ts`** — wraps the handlers in a Service Worker via `setupWorker`. Rarely needs changes.
- **`data/`** — JSON fixtures for larger responses (e.g. `tasks.json`). Keep bulky mock payloads here and import them into `handlers.ts` rather than inlining them — see [Mock data fixtures](#mock-data-fixtures).
- **`public/mockServiceWorker.js`** — the worker script MSW installs in the browser. It is **generated**, committed, and registered via the `msw.workerDirectory` field in `package.json`. Regenerate it (do not hand-edit) after an MSW upgrade — see [Regenerating the worker](#regenerating-the-worker-script).

## How it is wired up

Mocking is opt-in and gated on the **`USE_MOCK` environment variable**, independent of build mode. `main.tsx` starts the worker **before** React mounts:

```ts
async function enableMocking() {
  if (process.env.USE_MOCK !== 'true') {
    return;
  }
  const { worker } = await import('./mock-server/browser');
  return worker.start();
}

enableMocking().then(() => {
  createRoot(root).render(/* … <App /> … */);
});
```

### Controlling it via env

`USE_MOCK` and `API_BASE_URL` live in `modules/client/.env` (see `.env.example`) and are inlined into the bundle at build time by `dotenv-webpack` (configured with `systemvars: true`):

| `.env` value                         | Result                                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `USE_MOCK=true`                      | MSW starts and intercepts requests to `API_BASE_URL` — the app runs against the mocks.              |
| `USE_MOCK=false` (or unset)          | MSW never starts; requests go to the real server at `API_BASE_URL`.                                 |
| `API_BASE_URL=http://localhost:8000` | The base URL the axios client (and the handlers) target. Change it to point at a different backend. |

Because `systemvars: true` is set, you can also override for a single run without editing `.env` — e.g. in PowerShell: `$env:USE_MOCK='true'; pnpm dev`.

Two things keep this safe:

1. **`USE_MOCK` defaults to off.** Unless it is explicitly `'true'`, the worker is never started — so a production build (which should ship with `USE_MOCK=false`/unset) hits the real server.
2. **Dynamic `import()`** — `browser.ts` (and MSW) is only imported inside the guarded branch, so webpack can keep it out of the critical path when mocking is off.

> **Env is inlined at build time.** `dotenv-webpack` bakes `USE_MOCK`/`API_BASE_URL` into the bundle when webpack compiles. Changing `.env` requires **restarting `pnpm dev`** — the dev server does not hot-reload `.env`.

**Net effect:** `USE_MOCK=true` → mocks on. `USE_MOCK=false` → requests hit the real server at `API_BASE_URL`.

## Current scenarios

All handlers target `BASE_URL`, which is derived from the same env var as the axios client:

```ts
const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8000';
```

| Method | Path             | Response type       | Behaviour                                                                          |
| ------ | ---------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `POST` | `/auth/login`    | `ILoginResponse`    | Always succeeds; returns a static `mock-access-token` + 30-day cookie age.         |
| `GET`  | `/auth/refresh`  | `IRefreshResponse`  | Returns a fresh `mock-access-token`.                                               |
| `POST` | `/auth/register` | `IRegisterResponse` | Echoes the submitted `name`/`email`/`phoneNumber`/`role` back with a static `_id`. |
| `GET`  | `/task`          | `ITask[]`           | Returns the fixture tasks from `data/tasks.json` (a mix of TODO/IN-PROGRESS/DONE). |

> **`BASE_URL` tracks `API_BASE_URL` automatically.** Both the axios client (`api/client.ts`) and the handlers read `process.env.API_BASE_URL`, so they can't drift. MSW only intercepts requests whose URL matches a handler — as long as both use the same env var, changing the target only means editing `API_BASE_URL` in one place.

## Adding a scenario

Handlers are typed against the shared interfaces in `@/types`, so a mock's shape stays in lockstep with what the real API promises. To add one:

1. **Define/confirm the payload + response types** in `src/types/` (e.g. `task.types.ts`) and export them from `types/index.ts`.
2. **Add a handler** to the `handlers` array in `handlers.ts`. Type both the request body and the response so TypeScript catches drift:

   ```ts
   import { http, HttpResponse } from 'msw';
   import type { ITask } from '@/types';

   // inside the handlers array
   http.get(`${BASE_URL}/task`, () =>
     HttpResponse.json<ITask[]>([
       { /* … a mock task … */ },
     ]),
   ),
   ```

   For handlers that read the request body or params, make the callback `async` and pass the type through:

   ```ts
   http.post(`${BASE_URL}/task`, async ({ request }) => {
     const body = (await request.json()) as INewTaskPayload;
     return HttpResponse.json<ITask>({ /* … derived from body … */ });
   }),
   ```

3. **Restart `pnpm dev`** (or rely on HMR) and exercise the flow in the browser.

### Mock data fixtures

For anything bigger than a line or two, keep the payload in a JSON file under `src/mock-server/data/` and import it into `handlers.ts` — this keeps handlers readable and lets you edit sample data without touching logic.

1. **Add the fixture.** Create/extend a file such as `data/tasks.json`. Shape each entry to the interface it represents (e.g. `ITask` in `src/types/task.types.ts`), including required fields like `status`, `userId`, and `title`:

   ```json
   [
     {
       "id": "task-1",
       "status": "TODO",
       "userId": "mock-user-id",
       "title": "Draft Q3 product roadmap",
       "dueDate": "Jul 18",
       "project": "Roadmap",
       "isCompleted": false
     }
   ]
   ```

   > Use the **exact** enum string values the type expects (`"TODO"`, `"IN-PROGRESS"`, `"DONE"`) — the UI groups tasks by these literals.

2. **Import it in `handlers.ts`** and serve it. Because JSON is imported as a widened type (e.g. `status` is `string`, not the `TaskStatus` enum), cast it to the interface so `HttpResponse.json<T>()` stays type-checked:

   ```ts
   import type { ITask } from '@/types';
   import tasks from './data/tasks.json';

   // inside the handlers array
   http.get(`${BASE_URL}/task`, () => HttpResponse.json<ITask[]>(tasks as ITask[])),
   ```

3. **JSON imports require `resolveJsonModule`.** This is enabled in `modules/client/tsconfig.json` (`"resolveJsonModule": true`). Webpack and Jest both resolve `.json` natively, so no extra loader config is needed.

### Handler cookbook

| Goal                         | How                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Match a path param           | `http.get(`${BASE_URL}/task/:id`, ({ params }) => …)` — `params.id` is typed `string`. |
| Read query string            | `const url = new URL(request.url); url.searchParams.get('status')`                     |
| Return an error status       | `HttpResponse.json({ message: '…' }, { status: 401 })`                                 |
| Empty / 204 response         | `new HttpResponse(null, { status: 204 })`                                              |
| Simulate latency             | `import { delay } from 'msw'; await delay(800);` before returning                      |
| Conditional / stateful reply | Branch on the parsed body/params; keep any in-memory state in a module-level variable. |

Handlers are matched **top-to-bottom, first match wins**, so place more specific paths above catch-alls.

## Testing scenarios (temporary tweaks)

For one-off experiments (e.g. force a `401` to test the refresh interceptor), edit the relevant handler's status/body directly — but **revert before committing** unless the new behaviour is the intended default. The committed handlers are the shared "happy path" every developer boots into, so keep them representing a healthy backend.

## Regenerating the worker script

`public/mockServiceWorker.js` is generated by the MSW CLI and pinned to the installed MSW version. After bumping the `msw` dependency, regenerate it so the worker script matches the runtime:

```bash
pnpm dlx msw init public --save
```

The `--save` flag keeps the `msw.workerDirectory` entry in `package.json` (which points MSW at `public/`) up to date. Commit the regenerated file.

## Gotchas

- **Mocks only run when `USE_MOCK=true`.** If you added a handler and it isn't hit, confirm `USE_MOCK=true` in `.env`, that you **restarted `pnpm dev`** after editing `.env` (env is inlined at build time), and that the request URL matches `BASE_URL` (i.e. `API_BASE_URL`).
- **Unhandled requests pass through.** Requests without a matching handler are sent to the network as normal (MSW's default `onUnhandledRequest`), so a typo'd path silently hits the real (or non-existent) server rather than erroring loudly.
- **The worker is imported dynamically.** Never import `mock-server/browser` from application code — it must stay behind the `USE_MOCK` guard in `main.tsx` so it is tree-shaken out when mocking is off.
- **Types are the contract.** Always type `HttpResponse.json<T>()` and cast the request body to its interface, so a change to a shared type in `@/types` surfaces as a compile error in the mock.
