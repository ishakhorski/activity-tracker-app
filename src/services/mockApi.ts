import type { Activity, CreateActivity, UpdateActivity } from '@/types/activity'
import type { Completion, CreateCompletion } from '@/types/completion'
import type { ActivityMember, CreateActivityMember } from '@/types/activityMember'
import {
  STATISTIC_TYPE,
  type CompletionRateStatistic,
  type ThroughputStatistic,
  type StatisticType,
} from '@/types/statistics'
import { toLocalDateKey } from '@/utils/activities'

const MOCK_USER_ID = 'mock-user-id'

const MOCK_USERS: Record<string, string> = {
  'mock-user-id': 'You',
  'mock-user-alice': 'Alice Chen',
  'mock-user-bob': 'Bob Smith',
}

const ACTIVITIES_KEY = 'mock:activities'
const COMPLETIONS_KEY = 'mock:completions'
const ACTIVITY_MEMBERS_KEY = 'mock:activity-members'

// --- Storage helpers ---

const getItems = <T>(key: string): T[] => {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T[]) : []
}

const setItems = <T>(key: string, items: T[]): void => {
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

const json = (body: unknown, status = 200): MockResponse => ({ status, body })
const noContent = (): MockResponse => ({ status: 204 })
const notFound = (message = 'Not found'): MockResponse => ({
  status: 404,
  body: { error: message },
})

// --- Statistics helpers ---

const getScheduledTarget = (schedule: Activity['schedule'], dayOfWeek: number): number => {
  if (schedule.type === 'weekly') {
    return (schedule.days as number[]).includes(dayOfWeek) ? schedule.targetCompletions : 0
  }
  return schedule.targetCompletions
}

const computeCompletionRate = (
  activities: Activity[],
  completions: Completion[],
  fromDate: Date,
  toDate: Date,
): CompletionRateStatistic => {
  const byActivityDate: Record<string, Record<string, number>> = {}
  for (const c of completions) {
    const d = new Date(c.completedAt)
    if (d < fromDate || d > toDate) continue
    const actDates = (byActivityDate[c.activityId] ??= {})
    const key = toLocalDateKey(d)
    actDates[key] = (actDates[key] ?? 0) + 1
  }

  const dataMap: Record<string, { scheduled: number; completed: number }> = {}

  for (const activity of activities) {
    const actDates = byActivityDate[activity.id] ?? {}
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      const target = getScheduledTarget(activity.schedule, d.getDay())
      if (target === 0) continue
      const key = toLocalDateKey(d)
      const entry = (dataMap[key] ??= { scheduled: 0, completed: 0 })
      entry.scheduled += target
      entry.completed += Math.min(actDates[key] ?? 0, target)
    }
  }

  let totalScheduled = 0
  let totalCompleted = 0

  const data = Object.entries(dataMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { scheduled, completed }]) => {
      totalScheduled += scheduled
      totalCompleted += completed
      return {
        date,
        scheduled,
        completed,
        rate: scheduled > 0 ? Math.round((completed / scheduled) * 1000) / 1000 : 0,
      }
    })

  return {
    type: 'completion_rate',
    data,
    summary: {
      scheduled: totalScheduled,
      completed: totalCompleted,
      rate: totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 1000) / 1000 : 0,
    },
  }
}

const computeThroughput = (
  activities: Activity[],
  completions: Completion[],
  fromDate: Date,
  toDate: Date,
): ThroughputStatistic => {
  const activityIds = new Set(activities.map((a) => a.id))

  const byDate: Record<string, number> = {}
  for (const c of completions) {
    if (!activityIds.has(c.activityId)) continue
    const d = new Date(c.completedAt)
    if (d < fromDate || d > toDate) continue
    const key = toLocalDateKey(d)
    byDate[key] = (byDate[key] ?? 0) + 1
  }

  let total = 0
  let dayCount = 0
  const data: ThroughputStatistic['data'] = []

  for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
    const key = toLocalDateKey(d)
    const completed = byDate[key] ?? 0
    data.push({ date: key, completed })
    total += completed
    dayCount++
  }

  return {
    type: STATISTIC_TYPE.THROUGHPUT,
    data,
    summary: {
      total,
      average: dayCount > 0 ? Math.round((total / dayCount) * 100) / 100 : 0,
    },
  }
}

const parseDateRange = (url: URL): { fromDate: Date; toDate: Date } => {
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const fromDate = from ? new Date(from) : new Date(0)
  const toDate = to ? new Date(to) : new Date()
  fromDate.setHours(0, 0, 0, 0)
  toDate.setHours(23, 59, 59, 999)
  return { fromDate, toDate }
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
      const data = body as CreateActivity
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const now = new Date().toISOString()
      const activityId = crypto.randomUUID()
      const activity: Activity = {
        id: activityId,
        title: data.title,
        description: data.description,
        type: data.type,
        schedule: data.schedule,
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
      }
      all.push(activity)
      setItems(ACTIVITIES_KEY, all)

      const members = getItems<ActivityMember>(ACTIVITY_MEMBERS_KEY)
      members.push({
        id: crypto.randomUUID(),
        activityId,
        userId: MOCK_USER_ID,
        role: 'owner',
        createdAt: now,
        updatedAt: now,
      })
      setItems(ACTIVITY_MEMBERS_KEY, members)

      return json(activity.id, 201)
    },
  },

  // PATCH /activities/:id
  {
    method: 'PATCH',
    pattern: /^\/activities\/([^/]+)$/,
    handler: ({ match, body }) => {
      const all = getItems<Activity>(ACTIVITIES_KEY)
      const existing = all.find((a) => a.id === match[1])
      if (!existing) return notFound('Activity not found')
      const data = body as UpdateActivity
      const updated = { ...existing, ...data, updatedAt: new Date().toISOString() }
      all[all.indexOf(existing)] = updated
      setItems(ACTIVITIES_KEY, all)
      return json(updated.id)
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
      const { fromDate, toDate } = parseDateRange(url)

      const all = getItems<Completion>(COMPLETIONS_KEY).filter((c) => {
        const t = new Date(c.completedAt)
        return t >= fromDate && t <= toDate
      })

      const data = all.slice(offset, offset + limit).map((c) => ({
        ...c,
        displayName: MOCK_USERS[c.userId] ?? 'Unknown',
      }))
      return json({ data, total: all.length })
    },
  },

  // POST /completions
  {
    method: 'POST',
    pattern: /^\/completions\/?$/,
    handler: ({ body }) => {
      const data = body as CreateCompletion
      const all = getItems<Completion>(COMPLETIONS_KEY)
      const now = new Date().toISOString()
      const completion: Completion = {
        id: crypto.randomUUID(),
        activityId: data.activityId,
        userId: MOCK_USER_ID,
        completedAt: data.completedAt,
        note: data.note,
        createdAt: now,
        updatedAt: now,
      }
      all.push(completion)
      setItems(COMPLETIONS_KEY, all)
      return json(completion.id, 201)
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

  // GET /activities/:id/members
  {
    method: 'GET',
    pattern: /^\/activities\/([^/]+)\/activity-members\/?$/,
    handler: ({ match, url }) => {
      const limit = parseInt(url.searchParams.get('limit') ?? '100', 10)
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10)
      const all = getItems<ActivityMember>(ACTIVITY_MEMBERS_KEY).filter(
        (m) => m.activityId === match[1],
      )
      const data = all.slice(offset, offset + limit).map((m) => ({
        ...m,
        displayName: MOCK_USERS[m.userId] ?? 'Unknown',
      }))
      return json({ data, total: all.length })
    },
  },

  // POST /activity-members
  {
    method: 'POST',
    pattern: /^\/activity-members\/?$/,
    handler: ({ body }) => {
      const data = body as CreateActivityMember
      const all = getItems<ActivityMember>(ACTIVITY_MEMBERS_KEY)
      const now = new Date().toISOString()
      const member: ActivityMember = {
        id: crypto.randomUUID(),
        activityId: data.activityId,
        userId: data.userId,
        role: data.role,
        createdAt: now,
        updatedAt: now,
      }
      all.push(member)
      setItems(ACTIVITY_MEMBERS_KEY, all)
      return json(member.id, 201)
    },
  },

  // DELETE /activity-members/:id
  {
    method: 'DELETE',
    pattern: /^\/activity-members\/([^/]+)$/,
    handler: ({ match }) => {
      const all = getItems<ActivityMember>(ACTIVITY_MEMBERS_KEY)
      const index = all.findIndex((m) => m.id === match[1])
      if (index === -1) return notFound('ActivityMember not found')
      all.splice(index, 1)
      setItems(ACTIVITY_MEMBERS_KEY, all)
      return noContent()
    },
  },

  // GET /statistics/:type
  {
    method: 'GET',
    pattern: /^\/statistics\/([^/]+)\/?$/,
    handler: ({ match, url }) => {
      const type = match[1] as StatisticType
      const { fromDate, toDate } = parseDateRange(url)
      const activities = getItems<Activity>(ACTIVITIES_KEY).filter((a) => !a.archivedAt)
      const completions = getItems<Completion>(COMPLETIONS_KEY)

      if (type === STATISTIC_TYPE.COMPLETION_RATE)
        return json(computeCompletionRate(activities, completions, fromDate, toDate))
      if (type === STATISTIC_TYPE.THROUGHPUT)
        return json(computeThroughput(activities, completions, fromDate, toDate))
      return notFound('Unknown statistic type')
    },
  },

  // GET /activities/:id/statistics/:type
  {
    method: 'GET',
    pattern: /^\/activities\/([^/]+)\/statistics\/([^/]+)\/?$/,
    handler: ({ match, url }) => {
      const activityId = match[1]!
      const type = match[2] as StatisticType
      const activity = getItems<Activity>(ACTIVITIES_KEY).find((a) => a.id === activityId)
      if (!activity) return notFound('Activity not found')

      const { fromDate, toDate } = parseDateRange(url)
      const completions = getItems<Completion>(COMPLETIONS_KEY)

      if (type === STATISTIC_TYPE.COMPLETION_RATE)
        return json({
          activityId,
          ...computeCompletionRate([activity], completions, fromDate, toDate),
        })
      if (type === STATISTIC_TYPE.THROUGHPUT)
        return json({ activityId, ...computeThroughput([activity], completions, fromDate, toDate) })
      return notFound('Unknown statistic type')
    },
  },
]

const MOCK_KEYS = [ACTIVITIES_KEY, COMPLETIONS_KEY, ACTIVITY_MEMBERS_KEY]
const SEED_KEY = 'mock:seeded_v5'

const daysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

const pseudoRand = (a: number, b: number): number => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const generateCompletions = (
  activityIdx: number,
  activityId: string,
  createdAtStr: string,
  endAtStr: string,
  targetPerDay: number,
  scheduledDays: number[] | null,
  hitRate: number,
  userId: string = MOCK_USER_ID,
): Completion[] => {
  const completions: Completion[] = []
  const start = new Date(createdAtStr)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endAtStr)
  end.setHours(0, 0, 0, 0)

  let dayIdx = 0
  for (const d = new Date(start); d < end; d.setDate(d.getDate() + 1), dayIdx++) {
    const dayOfWeek = d.getDay()
    if (scheduledDays && !scheduledDays.includes(dayOfWeek)) continue

    const r = pseudoRand(activityIdx, dayIdx)
    if (r >= hitRate) continue

    const count = pseudoRand(activityIdx + 50, dayIdx) < 0.1 ? targetPerDay + 1 : targetPerDay

    for (let i = 0; i < count; i++) {
      const completedAt = new Date(d)
      completedAt.setHours(7 + i * 5, Math.floor(pseudoRand(i, dayIdx) * 45), 0, 0)
      const now = new Date().toISOString()
      completions.push({
        id: crypto.randomUUID(),
        activityId,
        userId,
        completedAt: completedAt.toISOString(),
        note: null,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  return completions
}

export const resetMockData = (): void => {
  MOCK_KEYS.forEach((key) => localStorage.removeItem(key))
  localStorage.removeItem(SEED_KEY)
  console.log('[Mock API] Storage cleared')
}

const seedMockData = (): void => {
  const today = new Date().toISOString()

  const activities: Activity[] = [
    {
      id: 'seed-act-1',
      title: 'Morning Run',
      description: 'Daily jog to start the day fresh.',
      type: 'personal',
      schedule: { type: 'daily', targetCompletions: 1 },
      createdAt: daysAgo(122),
      updatedAt: daysAgo(122),
      archivedAt: null,
    },
    {
      id: 'seed-act-2',
      title: 'Meditation',
      description: 'Morning and evening sessions.',
      type: 'personal',
      schedule: { type: 'daily', targetCompletions: 2 },
      createdAt: daysAgo(105),
      updatedAt: daysAgo(105),
      archivedAt: null,
    },
    {
      id: 'seed-act-3',
      title: 'Gym',
      description: null,
      type: 'personal',
      schedule: { type: 'weekly', days: [1, 3, 5], targetCompletions: 1 },
      createdAt: daysAgo(90),
      updatedAt: daysAgo(90),
      archivedAt: null,
    },
    {
      id: 'seed-act-4',
      title: 'Book Club',
      description: 'Weekly group reading sessions.',
      type: 'group',
      schedule: { type: 'weekly', days: [2, 4, 6], targetCompletions: 1 },
      createdAt: daysAgo(118),
      updatedAt: daysAgo(118),
      archivedAt: null,
    },
    {
      id: 'seed-act-5',
      title: 'Evening Journal',
      description: 'Reflect on the day before sleep.',
      type: 'personal',
      schedule: { type: 'daily', targetCompletions: 1 },
      createdAt: daysAgo(152),
      updatedAt: daysAgo(35),
      archivedAt: daysAgo(35),
    },
    {
      id: 'seed-act-6',
      title: 'Swimming',
      description: null,
      type: 'personal',
      schedule: { type: 'weekly', days: [2, 4], targetCompletions: 1 },
      createdAt: daysAgo(110),
      updatedAt: daysAgo(21),
      archivedAt: daysAgo(21),
    },
  ]

  const [act1, act2, act3, act4, act5, act6] = activities
  const completions: Completion[] = [
    ...generateCompletions(0, 'seed-act-1', act1!.createdAt, today, 1, null, 0.73),
    ...generateCompletions(1, 'seed-act-2', act2!.createdAt, today, 2, null, 0.68),
    ...generateCompletions(2, 'seed-act-3', act3!.createdAt, today, 1, [1, 3, 5], 0.8),
    ...generateCompletions(3, 'seed-act-4', act4!.createdAt, today, 1, [2, 4, 6], 0.65),
    ...generateCompletions(
      6,
      'seed-act-4',
      act4!.createdAt,
      today,
      1,
      [2, 4, 6],
      0.8,
      'mock-user-alice',
    ),
    ...generateCompletions(
      7,
      'seed-act-4',
      act4!.createdAt,
      today,
      1,
      [2, 4, 6],
      0.55,
      'mock-user-bob',
    ),
    ...generateCompletions(4, 'seed-act-5', act5!.createdAt, act5!.archivedAt!, 1, null, 0.77),
    ...generateCompletions(5, 'seed-act-6', act6!.createdAt, act6!.archivedAt!, 1, [2, 4], 0.72),
  ]

  const members: ActivityMember[] = [
    ...activities.map((a) => ({
      id: crypto.randomUUID(),
      activityId: a.id,
      userId: MOCK_USER_ID,
      role: 'owner' as const,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    })),
    {
      id: crypto.randomUUID(),
      activityId: 'seed-act-4',
      userId: 'mock-user-alice',
      role: 'member' as const,
      createdAt: act4!.createdAt,
      updatedAt: act4!.createdAt,
    },
    {
      id: crypto.randomUUID(),
      activityId: 'seed-act-4',
      userId: 'mock-user-bob',
      role: 'member' as const,
      createdAt: act4!.createdAt,
      updatedAt: act4!.createdAt,
    },
  ]

  setItems(ACTIVITIES_KEY, activities)
  setItems(COMPLETIONS_KEY, completions)
  setItems(ACTIVITY_MEMBERS_KEY, members)

  localStorage.setItem(SEED_KEY, '1')
  console.log(
    `[Mock API] Seeded ${activities.length} activities (${activities.filter((a) => a.archivedAt).length} archived) and ${completions.length} completions`,
  )
}

export const resetAndSeedMockData = (): void => {
  resetMockData()
  seedMockData()
}

// --- Fetch interceptor ---

interface MockApiOptions {
  delay?: number
}

export const enableMockApi = (options: MockApiOptions = {}): void => {
  const { delay = 50 } = options
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(input, init)
    const method = (init?.method ?? request.method ?? 'GET').toUpperCase()
    const url = new URL(request.url)
    const pathname = url.pathname.replace(/^\/api/, '')

    for (const route of routes) {
      if (route.method !== method) continue
      const match = pathname.match(route.pattern)
      if (!match) continue

      let body: unknown
      if (init?.body) {
        try {
          body = JSON.parse(init.body as string)
        } catch {
          body = init.body
        }
      }

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

  if (!localStorage.getItem(SEED_KEY)) seedMockData()
  ;(window as unknown as Record<string, unknown>).__mockApi = {
    reset: resetMockData,
    seed: resetAndSeedMockData,
  }

  console.log(`[Mock API] Enabled — using localStorage as backend (delay: ${delay}ms)`)
  console.log('[Mock API] Dev helpers: window.__mockApi.reset() | window.__mockApi.seed()')
}
