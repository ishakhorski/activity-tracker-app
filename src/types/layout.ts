export const LAYOUT = {
  MAIN: 'main',
  SECONDARY: 'secondary',
  AUTH: 'auth',
  EMPTY: 'empty',
} as const

export type Layout = (typeof LAYOUT)[keyof typeof LAYOUT]
