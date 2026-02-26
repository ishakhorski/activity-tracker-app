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

**Mock API:** `src/plugins/mockApiPlugin.ts` intercepts `fetch` calls in development (2s simulated delay) to enable offline development without a backend.

### Directory Structure

```
src/
├── components/
│   ├── atoms/        # Primitive UI elements (Button, Input, Dialog, etc.)
│   ├── molecules/    # Composed atoms (PageHeader, PageContent, AppLogo)
│   └── organisms/    # Feature-level components (ActivityCard, CreateActivityDialog)
├── composables/      # Reusable logic — useActivities, useCompletions, useAuth, useTheme
├── layouts/          # AuthLayout, MainLayout, SecondaryLayout, EmptyLayout
├── plugins/          # Vue plugins: Auth0, TanStack Query, Mock API
├── router/           # Routes with meta.layout and auth guards
├── services/
│   ├── http/         # Custom fetch-based HTTP client with HttpError class
│   └── *.ts          # Service modules per resource (activitiesService, completionsService, etc.)
├── types/            # TypeScript interfaces: Activity, Completion, Schedule, etc.
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

Composables wrap services with TanStack Query and expose reactive state:

```typescript
// composables/useActivities.ts
export function useActivities() {
  const query = useQuery({ queryKey: ['activities'], queryFn: getAllActivities })
  const mutation = useMutation({ mutationFn: createActivity, onMutate: ..., onError: ... })
  return { activities: query.data, createActivity: mutation.mutate, ... }
}
```

Mutations use **optimistic updates** — update the cache immediately, roll back on error, then invalidate to refetch.

### Data Models

- `Activity`: `id`, `title`, `description`, `type` (`personal` | `group`), `schedule`, `archivedAt`
- `Schedule`: `DailySchedule { type: 'daily', targetCompletions }` or `WeeklySchedule { type: 'weekly', days: Weekday[], targetCompletions }`
- `Completion`: `id`, `activityId`, `userId`, `completedAt`, `note`

### Code Style

Enforced by Prettier + ESLint — run `npm run lint` to auto-fix:

- No semicolons, single quotes, 100-char line width, trailing commas
- `<script setup lang="ts">` for all SFCs
- Path alias `@/*` resolves to `src/*`
- Unused vars allowed if prefixed with `__`
- Flag variables prefixed with `is`
- Priority yo use arrow functions

### Environment Variables

See `.env.example` for required variables:

```
VITE_API_BASE_URL=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
```
