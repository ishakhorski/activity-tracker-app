export const ACTIVITY_SCHEDULE_TYPE = {
  DAILY: "daily",
  WEEKLY: "weekly",
} as const;

export const WEEKDAY = {
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  SUN: 0,
} as const;

export type Weekday = (typeof WEEKDAY)[keyof typeof WEEKDAY];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  [WEEKDAY.MON]: "Mon",
  [WEEKDAY.TUE]: "Tue",
  [WEEKDAY.WED]: "Wed",
  [WEEKDAY.THU]: "Thu",
  [WEEKDAY.FRI]: "Fri",
  [WEEKDAY.SAT]: "Sat",
  [WEEKDAY.SUN]: "Sun",
};

export const WEEKDAYS_ORDERED: Weekday[] = [
  WEEKDAY.MON,
  WEEKDAY.TUE,
  WEEKDAY.WED,
  WEEKDAY.THU,
  WEEKDAY.FRI,
  WEEKDAY.SAT,
  WEEKDAY.SUN,
];

export interface DailySchedule {
  type: typeof ACTIVITY_SCHEDULE_TYPE.DAILY;
  targetCompletions: number;
}

export interface WeeklySchedule {
  type: typeof ACTIVITY_SCHEDULE_TYPE.WEEKLY;
  days: Weekday[];
  targetCompletions: number;
}

export type ActivitySchedule = DailySchedule | WeeklySchedule;
