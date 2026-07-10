# Mock Server — `@kronos/client`

The client ships with an in-browser mock API built on [MSW (Mock Service Worker)](https://mswjs.io/). It intercepts outgoing `fetch`/XHR requests at the Service Worker layer and answers them with canned responses, so the SPA can run **without a live `@kronos/server`** during development.

Because MSW patches the network at the browser boundary, the app's `axios` client (`api/client.ts`) is untouched — it makes the same requests it would in production and never knows the responses are mocked.

## Files

```
src/mock-server/
├── handlers.ts   # Request handlers — one per mocked endpoint
└── browser.ts    # setupWorker(...handlers) → exports `worker`

public/
└── mockServiceWorker.js   # Generated MSW worker script (do not edit by hand)
```

- **`handlers.ts`** — the array of `http.*` handlers. This is the file you edit to add or change mocked scenarios.
- **`browser.ts`** — wraps the handlers in a Service Worker via `setupWorker`. Rarely needs changes.
- **`public/mockServiceWorker.js`** — the worker script MSW installs in the browser. It is **generated**, committed, and registered via the `msw.workerDirectory` field in `package.json`. Regenerate it (do not hand-edit) after an MSW upgrade — see [Regenerating the worker](#regenerating-the-worker-script).

## How it is wired up

Mocking is opt-in and gated on the build mode. `main.tsx` starts the worker **before** React mounts:

```ts
async function enableMocking() {
  if (process.env.ENV !== 'development') {
    return;
  }
  const { worker } = await import('./mock-server/browser');
  return worker.start();
}

enableMocking().then(() => {
  createRoot(root).render(/* … <App /> … */);
});
```

Two things make this safe for production:

1. **`process.env.ENV`** is injected by webpack's `DefinePlugin` from the build mode (`argv.mode`). It is `'development'` under `pnpm dev` and `'production'` under `pnpm build`, so the mock worker is **never started in a production bundle**.
2. **Dynamic `import()`** — `browser.ts` (and MSW) is only imported inside the `development` branch, so webpack can keep it out of the production critical path.

**Net effect:** `pnpm dev` → mocks on. `pnpm build` → mocks off, requests hit the real server.

## Current scenarios

All handlers target `BASE_URL = http://localhost:8080` (defined at the top of `handlers.ts`).

| Method | Path             | Response type       | Behaviour                                                                          |
| ------ | ---------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `POST` | `/auth/login`    | `ILoginResponse`    | Always succeeds; returns a static `mock-access-token` + 30-day cookie age.         |
| `GET`  | `/auth/refresh`  | `IRefreshResponse`  | Returns a fresh `mock-access-token`.                                               |
| `POST` | `/auth/register` | `IRegisterResponse` | Echoes the submitted `name`/`email`/`phoneNumber`/`role` back with a static `_id`. |

> **Keep the `BASE_URL` in sync.** Handlers hard-code `http://localhost:8080`, which must match `API_BASE_URL` in `.env` (the axios `baseURL`). MSW only intercepts requests whose URL matches a handler, so a mismatch means real (failing) network calls instead of mocks.

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

- **Mocks only run under `pnpm dev`.** If you added a handler and it isn't hit, confirm you're on the dev server, not a production build, and that the request URL matches `BASE_URL`.
- **Unhandled requests pass through.** Requests without a matching handler are sent to the network as normal (MSW's default `onUnhandledRequest`), so a typo'd path silently hits the real (or non-existent) server rather than erroring loudly.
- **The worker is imported dynamically.** Never import `mock-server/browser` from application code — it must stay behind the `development` guard in `main.tsx` so it is tree-shaken out of production.
- **Types are the contract.** Always type `HttpResponse.json<T>()` and cast the request body to its interface, so a change to a shared type in `@/types` surfaces as a compile error in the mock.
