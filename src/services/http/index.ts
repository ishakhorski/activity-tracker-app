import { HttpClient } from './httpClient'

export const http = new HttpClient(import.meta.env.VITE_API_BASE_URL ?? '')
