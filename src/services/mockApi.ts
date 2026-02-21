import type { Activity } from '@/types/activity'
import type { Completion } from '@/types/completion'

const ACTIVITIES_KEY = 'mock:activities'
const COMPLETIONS_KEY = 'mock:completions'

// --- Storage helpers ---

function getItems<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T[]) : []
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items))
}

// --- Route matching ---

type RouteHandler = (params: { match: RegExpMatchArray; url: URL; body: unknown }) => MockResponse

interface Route {
  method: string
  pattern: RegExp
  handler: RouteHandler
}

interface MockResponse {
  status: number
  body?: unknown
}

function json(body: unknown, status = 200): MockResponse {
  return { status, body }
}

function noContent(): MockResponse {
  return { status: 204 }
}

function notFound(message = 'Not found'): MockResponse {
  return { status: 404, body: { error: message } }
}

// --- Routes ---

const routes: Route[] = [
  // GET /activities
  {
    method: 'GET',
    pattern: /^\/activities\/?$/,
    handler: ({ url }) => {
      const limit = parseInt(url.searchParams.get('limit') ?? '100', 10)
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10)
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const data = all.slice(offset, offset + limit)
      return json({ data, total: all.length })
    },
  },

  // GET /activities/:id
  {
    method: 'GET',
    pattern: /^\/activities\/([^/]+)$/,
    handler: ({ match }) => {
      const activity = getItems<Activity>(ACTIVITIES_KEY).find((a) => a.id === match[1])
      return activity ? json(activity) : notFound('Activity not found')
    },
  },

  // POST /activities
  {
    method: 'POST',
    pattern: /^\/activities\/?$/,
    handler: ({ body }) => {
      const data = body as { title: string; schedule: Activity['schedule'] }
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const now = new Date().toISOString()
      const activity: Activity = {
        id: crypto.randomUUID(),
        title: data.title,
        schedule: data.schedule,
        createdAt: now,
        updatedAt: now,
      }
      all.push(activity)
      setItems(ACTIVITIES_KEY, all)
      return json(activity, 201)
    },
  },

  // PATCH /activities/:id
  {
    method: 'PATCH',
    pattern: /^\/activities\/([^/]+)$/,
    handler: ({ match, body }) => {
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const index = all.findIndex((a) => a.id === match[1])
      if (index === -1) return notFound('Activity not found')
      const data = body as Partial<Pick<Activity, 'title' | 'schedule'>>
      all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() }
      setItems(ACTIVITIES_KEY, all)
      return json(all[index])
    },
  },

  // POST /activities/:id/archive
  {
    method: 'POST',
    pattern: /^\/activities\/([^/]+)\/archive$/,
    handler: ({ match }) => {
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const index = all.findIndex((a) => a.id === match[1])
      if (index === -1) return notFound('Activity not found')
      const now = new Date().toISOString()
      all[index] = { ...all[index], archivedAt: now, updatedAt: now }
      setItems(ACTIVITIES_KEY, all)
      return json(all[index])
    },
  },

  // POST /activities/:id/unarchive
  {
    method: 'POST',
    pattern: /^\/activities\/([^/]+)\/unarchive$/,
    handler: ({ match }) => {
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const index = all.findIndex((a) => a.id === match[1])
      if (index === -1) return notFound('Activity not found')
      const { archivedAt: _, ...rest } = all[index]
      all[index] = { ...rest, updatedAt: new Date().toISOString() } as Activity
      setItems(ACTIVITIES_KEY, all)
      return json(all[index])
    },
  },

  // DELETE /activities/:id
  {
    method: 'DELETE',
    pattern: /^\/activities\/([^/]+)$/,
    handler: ({ match }) => {
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const index = all.findIndex((a) => a.id === match[1])
      if (index === -1) return notFound('Activity not found')
      all.splice(index, 1)
      setItems(ACTIVITIES_KEY, all)
      return noContent()
    },
  },

  // GET /completions
  {
    method: 'GET',
    pattern: /^\/completions\/?$/,
    handler: ({ url }) => {
      const limit = parseInt(url.searchParams.get('limit') ?? '100', 10)
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10)
      const from = url.searchParams.get('from')
      const to = url.searchParams.get('to')

      let all = getItems<Completion>(COMPLETIONS_KEY)

      if (from && to) {
        const fromDate = new Date(from)
        const toDate = new Date(to)
        fromDate.setHours(0, 0, 0, 0)
        toDate.setHours(23, 59, 59, 999)
        all = all.filter((c) => {
          const t = new Date(c.completedAt)
          return t >= fromDate && t <= toDate
        })
      }

      const data = all.slice(offset, offset + limit)
      return json({ data, total: all.length })
    },
  },

  // POST /completions
  {
    method: 'POST',
    pattern: /^\/completions\/?$/,
    handler: ({ body }) => {
      const data = body as { activityId: string; completedAt: string }
      const all = getItems<Completion>(COMPLETIONS_KEY)
      const now = new Date().toISOString()
      const completion: Completion = {
        id: crypto.randomUUID(),
        activityId: data.activityId,
        completedAt: data.completedAt,
        createdAt: now,
        updatedAt: now,
      }
      all.push(completion)
      setItems(COMPLETIONS_KEY, all)
      return json(completion, 201)
    },
  },

  // DELETE /completions/:id
  {
    method: 'DELETE',
    pattern: /^\/completions\/([^/]+)$/,
    handler: ({ match }) => {
      const all = getItems<Completion>(COMPLETIONS_KEY)
      const index = all.findIndex((c) => c.id === match[1])
      if (index === -1) return notFound('Completion not found')
      all.splice(index, 1)
      setItems(COMPLETIONS_KEY, all)
      return noContent()
    },
  },
]

// --- Fetch interceptor ---

interface MockApiOptions {
  delay?: number
}

export function enableMockApi(options: MockApiOptions = {}): void {
  const { delay = 50 } = options
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(input, init)
    const method = (init?.method ?? request.method ?? 'GET').toUpperCase()
    const url = new URL(request.url)

    for (const route of routes) {
      if (route.method !== method) continue
      const match = url.pathname.match(route.pattern)
      if (!match) continue

      let body: unknown
      if (init?.body) {
        try {
          body = JSON.parse(init.body as string)
        } catch {
          body = init.body
        }
      }

      // Simulate network delay
      await new Promise((r) => setTimeout(r, delay))

      const result = route.handler({ match, url, body })

      return new Response(result.body !== undefined ? JSON.stringify(result.body) : null, {
        status: result.status,
        statusText: result.status === 204 ? 'No Content' : result.status >= 400 ? 'Error' : 'OK',
        headers: result.body !== undefined ? { 'Content-Type': 'application/json' } : {},
      })
    }

    return originalFetch(input, init)
  }

  console.log(`[Mock API] Enabled — using localStorage as backend (delay: ${delay}ms)`)
}
