export const AUTH_ROLE = {
  PUBLIC: "public",
  USER: "user",
} as const;
export type AuthRole = (typeof AUTH_ROLE)[keyof typeof AUTH_ROLE];

export const AUTH_CONNECTOR = {
  GOOGLE: "google-oauth2",
  APPLE: "apple",
} as const;
export type AuthConnector = (typeof AUTH_CONNECTOR)[keyof typeof AUTH_CONNECTOR];
