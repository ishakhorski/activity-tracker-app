# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (HTTPS via mkcert)
npm run build        # Type-check + build for production
npm run type-check   # Run vue-tsc only
npm run lint         # Type-check + ESLint with auto-fix
npm run format       # Prettier format src/
npm run preview      # Preview production build
```

No test runner is configured.

## Architecture

**Pulse** is a Vue 3 + TypeScript SPA for activity/habit tracking. Built with Vite, Tailwind CSS v4, and Reka UI (headless components).

### Key Patterns

**Layered architecture:**

```
views → composables → services → HTTP client
             ↓
         TanStack Query (server state cache)
```

**No Pinia/Vuex.** All state is managed via:

- TanStack Query (`@tanstack/vue-query`) for server state — queries, mutations, optimistic updates, cache invalidation
- Vue composition API refs/computed for local UI state
- Auth0 SPA client (injected via plugin) for auth state

**Dynamic layout system:** Routes declare `meta.layout` (`auth` | `main` | `secondary` | `empty`). `App.vue` dynamically loads the matching layout component from `src/layouts/`.

**Mock API:** `src/plugins/mockApiPlugin.ts` intercepts `fetch` calls via a `beforeFetch` event listener. Data is persisted in localStorage (`mock:activities`, `mock:completions`, `mock:activity-members`). Seed data is initialized once under `mock:seeded_v3`.

### Directory Structure

```
src/
├── components/
│   ├── atoms/        # Primitive UI elements (Button, Input, Dialog, etc.)
│   ├── molecules/    # Composed atoms (PageHeader, PageContent, ActivityBrick, grids)
│   └── organisms/    # Feature-level components (ActivityCard, CreateActivityDialog)
├── composables/
│   ├── queries/      # TanStack Query hooks (useActivitiesQuery, useCompletionsQuery, etc.)
│   └── mutations/    # TanStack mutations (useActivityCreateMutation, useCompletionCreateMutation, etc.)
├── layouts/          # AuthLayout, MainLayout, SecondaryLayout, EmptyLayout
├── plugins/          # Vue plugins: Auth0, TanStack Query, Mock API
├── router/           # Routes with meta.layout and auth guards
├── services/
│   ├── http/         # HttpClient class + HttpError (fetch-based, no axios)
│   └── *.ts          # Service modules per resource (activitiesService, completionsService, etc.)
├── types/            # TypeScript interfaces: Activity, EnrichedActivity, Completion, Schedule, DaysGrid, etc.
├── utils/            # Pure utility functions (activity scheduling, completion date logic)
└── views/            # Page components
```

### Service / Composable Pattern

Services expose plain async functions (no class instances):

```typescript
// services/activitiesService.ts
export const getAllActivities = (pagination) => http.get(...)
export const updateActivity = (id, data) => http.patch(...)
```

Queries live in `composables/queries/` and mutations in `composables/mutations/`:

```typescript
// composables/queries/useActivitiesQuery.ts
const ACTIVITIES_QUERY_KEY = ['activities'] as const
export const useActivitiesQuery = () => useQuery({
  queryKey: ACTIVITIES_QUERY_KEY,
  queryFn: () => getAllActivities().then(res => res.data),
})
```

**Optimistic updates** use a temp ID pattern: generate `temp-${crypto.randomUUID()}` in `onMutate`, replace with the real server ID in `onSuccess`, roll back in `onError`, then invalidate in `onSettled`.

The `useEnrichedActivities()` composable combines the activities and completions queries into a single computed — filtering archived, mapping via `enrichActivity()`, and sorting so completed activities appear last.

### Data Models

- `Activity`: `id`, `title`, `description`, `type` (`personal` | `group`), `schedule`, `archivedAt`
- `EnrichedActivity`: `Activity` + `completionsByDate: Record<string, Completion[]>` (populated by `enrichActivity()` in `utils/activities.ts`)
- `Schedule`: `DailySchedule { type: 'daily', targetCompletions }` or `WeeklySchedule { type: 'weekly', days: Weekday[], targetCompletions }`
- `Completion`: `id`, `activityId`, `userId`, `completedAt`, `note`
- `DaysGrid`: array of `{ dateKey, dayNumber, weekday, weekdayLabel, position: 'past' | 'today' | 'future' }`

### Key Utility Functions

`utils/activities.ts`:
- `enrichActivity(activity, completions)` — merges completions into `completionsByDate` record
- `isScheduledOnDay(activity, dayOfWeek)` / `isScheduledToday(activity)` — schedule checks
- `getDayStatus(count, target)` → `'completed' | 'partial' | 'uncompleted' | 'none'`
- `DAY_STATUS_BRICK_VARIANT` — maps status to ActivityBrick variant (`solid | soft | faint | ghost`)

`utils/completions.ts`:
- `getDateRange(days?)` — ISO date range for the last N days
- `getTodayCompletionCount(completions, activityId)`

### HTTP Client

`services/http/httpClient.ts` exports a singleton `http` instance of `HttpClient`. All methods accept an `options` object with `searchParams` and `signal`. Errors throw `HttpError` with `status`, `statusText`, and `body`. A 204 response returns `undefined`.

### Auth

`src/plugins/auth0Plugin.ts` wraps `@auth0/auth0-spa-js`. The plugin provides `Auth0State` (isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently) via `app.provide()`. Use `useAuth0()` to inject it. Auth roles (`PUBLIC` / `USER`) and connectors (`google-oauth2` / `apple`) are declared as constants in the plugin.

### Code Style

Enforced by Prettier + ESLint — run `npm run lint` to auto-fix:

- No semicolons, single quotes, 100-char line width, trailing commas
- `<script setup lang="ts">` for all SFCs
- Path alias `@/*` resolves to `src/*`
- Unused vars allowed if prefixed with `__`
- Flag variables prefixed with `is`
- Prefer arrow functions

### Environment Variables

See `.env.example` for required variables:

```
VITE_API_BASE_URL=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
```
