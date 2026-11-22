import type { ErrorRequestHandler } from 'express'
import { HttpError } from '../errors.js'

interface BodyParserError {
  status: number
  type: string
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as BodyParserError).status === 'number' &&
    typeof (error as BodyParserError).type === 'string'
  )
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message })
    return
  }

  if (isBodyParserError(error) && error.status >= 400 && error.status < 500) {
    const message = error.status === 413 ? 'Тіло запиту завелике' : 'Некоректний JSON у тілі запиту'
    res.status(error.status).json({ message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Внутрішня помилка сервера' })
}
