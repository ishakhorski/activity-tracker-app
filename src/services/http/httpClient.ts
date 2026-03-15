import { HttpError } from './httpError'

export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
}

export class HttpClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private tokenGetter: (() => Promise<string>) | null = null

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.defaultHeaders = defaultHeaders
  }

  setTokenGetter(fn: () => Promise<string>): void {
    this.tokenGetter = fn
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options)
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options)
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options)
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options)
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options)
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params)

    const headers: Record<string, string> = { ...this.defaultHeaders }

    if (this.tokenGetter) {
      const token = await this.tokenGetter()
      headers['Authorization'] = `Bearer ${token}`
    }

    Object.assign(headers, options?.headers)

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    let response: Response
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      })
    } catch (error) {
      throw error instanceof HttpError ? error : new HttpError(0)
    }

    if (!response.ok) {
      throw new HttpError(response.status)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get('Content-Type') ?? ''
    if (contentType.includes('application/json')) {
      return (await response.json()) as T
    }
    return (await response.text()) as T
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/'
    const relativePath = path.startsWith('/') ? path.slice(1) : path
    const url = new URL(relativePath, base)

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value))
      }
    }

    return url.toString()
  }
}
