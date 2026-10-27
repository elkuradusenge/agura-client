# AGUra frontend

React 18, TypeScript, Vite, TanStack Query, Tailwind, Recharts, Lucide and Syne.
One application, two audiences: a farmer app at `/app` and an internal console at `/admin`.

## Run it

```bash
yarn install
cp .env.example .env
yarn dev
```

Use **Yarn 1 (classic)**, pinned in `packageManager`. `yarn.lock` is committed;
commit the lockfile with any dependency change and do not mix in another package
manager, because a second lockfile silently resolves a different tree.

| Script | Purpose |
| --- | --- |
| `yarn dev` | Vite dev server on port 5173 |
| `yarn build` | type check then production build into `dist/` |
| `yarn preview` | serve the production build |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn test` | Vitest |
| `yarn check:em-dash` | ban the em dash in copy and code |
| `yarn check:icons` | only Lucide may be imported |
| `yarn check:font` | only Syne may be used as a typeface |
| `yarn check:all` | all of the above |

## Environment

```
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_WS_URL=ws://127.0.0.1:8000/ws
```

The backend mounts the REST router under `/api/v1` and the WebSocket at `/ws`,
so the two URLs are not derived from each other. Start the backend first; without
it the app still renders and shows explicit offline states rather than blank pages.

## Layout

```
src/
  app/          providers, router, guards
  components/   ui primitives, layout shells, charts, toasts
  features/
    auth/       welcome, sign up, sign in, reset, admin sign in
    products/   list, accordion detail, plant checklist
    plantings/  my plantings and one planting's timeline
    tasks/      today, morning and evening
    notifications/
    help/       specialist request and partners
    funding/    BRD interest form
    settings/   language, reminders, quiet hours, password, delete
    admin/      the console, lazy loaded
    styleguide/ the living style guide at /style-guide
  lib/
    api/        typed client, wire types, refresh handling
    i18n/       provider plus rw, en, fr dictionaries
    ws/         reconnecting socket client with catch-up
    utils.ts    formatting, Kigali time
  test/         Vitest setup and tests
scripts/        the three style checks
```

## Rules the code holds to

- **Status is never colour only.** Every badge carries text.
- **Suppression is shown, not hidden.** A withheld census cell renders a labelled
  badge with the reason, never `0` and never a blank.
- **Tap targets are at least 44px.** The `tap-target` utility in `index.css`.
- **Focus is always visible.** Focus rings are declared globally, never removed.
- **Kigali time.** Due times are formatted in `Africa/Kigali`, not the browser zone.
- **Low data mode** is a preference that trims chart payloads and imagery; it is
  stored in local storage and applied to `<html data-low-data>`.
- **Offline is a state, not an error.** The last good data stays on screen behind
  an offline banner.
- **House style:** no em dash, Lucide only, Syne only, all enforced by scripts.

## Authentication

Two account kinds share one token store. `tokens.kind()` records which kind a
session belongs to so a refresh retries as the right audience. The access token
goes in the `Authorization` header; a 401 triggers one refresh attempt and then a
local sign out. The WebSocket sends the token in the first message rather than in
the query string.

## i18n

`rw` is the default; lookups fall back to `en` and then `rw`, and a missing key
returns the key itself so it is visible in review. `{variable}` placeholders are
interpolated. The three dictionaries are kept key-identical by a test.

## Hardening notes

- **Auth rejection stops the socket.** A `1008` close means the token was refused,
  so the client stops retrying instead of hammering the server until sign in.
- **Reconnect catch-up.** Every reconnect sends the last event timestamp as a
  `since` cursor and refetches on `connection.ready`, so nothing is missed silently.
- **Tokens live in local storage.** The access token is short lived and the refresh
  token rotates, which is the usual trade for a mobile-first app with no cookie
  domain. If the deployment gains a shared cookie domain, move them to httpOnly
  cookies and drop the storage helpers in `lib/api/client.ts`.
- **No injection sinks.** There is no `dangerouslySetInnerHTML` and no `innerHTML`
  anywhere in `src`; all server text renders as text nodes.
- **Nothing is logged.** No token, response or user field reaches the console.
- **Low data mode** hides images through `html[data-low-data="true"] img` and the
  preference is honoured before first paint.
- **Reduced motion** is respected globally in `index.css`.

## Design decisions worth knowing

- The console bundle is lazy loaded. A farmer never downloads it.
- Recharts lives in its own chunk, so the farmer entry stays small.
- `@testing-library/dom` is an explicit devDependency because both
  `@testing-library/react` and `@testing-library/jest-dom` declare it as a peer.
  A package manager that hoists it transitively hides the omission; Yarn 1 does
  not, so it is declared rather than assumed.
- `resolutions` pins Vite to one major. `vitest` declares Vite as a plain
  dependency rather than a peer, so Yarn would otherwise nest a second, newer Vite
  beside the app's own and the config types would stop matching. One Vite at a time.
- The style guide at `/style-guide` is the source of truth for tokens. Change the
  guide when you change a token.
