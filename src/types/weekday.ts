export const WEEKDAY = {
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  SUN: 0,
} as const

export type Weekday = (typeof WEEKDAY)[keyof typeof WEEKDAY]

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  [WEEKDAY.MON]: 'Mon',
  [WEEKDAY.TUE]: 'Tue',
  [WEEKDAY.WED]: 'Wed',
  [WEEKDAY.THU]: 'Thu',
  [WEEKDAY.FRI]: 'Fri',
  [WEEKDAY.SAT]: 'Sat',
  [WEEKDAY.SUN]: 'Sun',
}

export const WEEKDAYS_ORDERED: Weekday[] = [
  WEEKDAY.MON,
  WEEKDAY.TUE,
  WEEKDAY.WED,
  WEEKDAY.THU,
  WEEKDAY.FRI,
  WEEKDAY.SAT,
  WEEKDAY.SUN,
]
