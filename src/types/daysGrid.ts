export type DayPosition = 'past' | 'today' | 'future'

export interface DaysGridItem {
  dateKey: string
  dayNumber: number
  weekday: number // 0 (Sun) – 6 (Sat), matches Date.getDay()
  weekdayLabel: string
  position: DayPosition
}

export type DaysGrid = DaysGridItem[]
