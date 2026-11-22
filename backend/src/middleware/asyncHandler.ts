import type { Request, RequestHandler, Response } from 'express'

/** Express 4 не ловить відхилені проміси — передаємо помилку в next() вручну. */
export function asyncHandler(handler: (req: Request, res: Response) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    handler(req, res).catch(next)
  }
}
