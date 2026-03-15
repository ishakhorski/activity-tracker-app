export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP Error ${status}`)
    this.name = 'HttpError'
  }
}
