import { HttpError } from './errors.js'
import type { Game } from './types.js'

type Body = Record<string, unknown>

export interface ReviewInput {
  author: string
  is_recommended: boolean
  hours_played: number
  text: string
}

function asBody(value: unknown): Body {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new HttpError(400, "Тіло запиту має бути JSON-об'єктом")
  }
  return value as Body
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

function readString(body: Body, field: string, label: string, max: number, required: boolean, errors: string[]): string {
  const value = body[field]
  if (isEmpty(value)) {
    if (required) errors.push(`${label}: обов'язкове поле`)
    return ''
  }
  if (typeof value !== 'string') {
    errors.push(`${label} має бути рядком`)
    return ''
  }
  const trimmed = value.trim()
  if (trimmed.length > max) {
    errors.push(`${label}: максимум ${max} символів`)
    return ''
  }
  return trimmed
}

function readNumber(body: Body, field: string, label: string, required: boolean, errors: string[]): number | null {
  const value = body[field]
  if (value === undefined || value === null) {
    if (required) errors.push(`${label}: обов'язкове поле`)
    return null
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    errors.push(`${label} має бути числом`)
    return null
  }
  return value
}

export function isValidDiscount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 90
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function throwIfErrors(errors: string[]): void {
  if (errors.length > 0) throw new HttpError(400, errors.join('; '))
}

export function parseCreateGame(raw: unknown): Omit<Game, 'id'> {
  const body = asBody(raw)
  const errors: string[] = []

  const title = readString(body, 'title', 'Назва', 100, true, errors)
  const genre = readString(body, 'genre', 'Жанр', 50, true, errors)
  const developer = readString(body, 'developer', 'Розробник', 100, false, errors)
  const description = readString(body, 'description', 'Опис', 2000, false, errors)
  const imageUrl = readString(body, 'image_url', 'Посилання на обкладинку', 500, false, errors)
  if (imageUrl && !isHttpUrl(imageUrl)) {
    errors.push('Посилання на обкладинку має бути коректною http(s)-адресою')
  }

  const price = readNumber(body, 'price', 'Ціна', true, errors)
  if (price !== null && !(price > 0 && price <= 100000)) {
    errors.push('Ціна має бути більшою за 0 і не перевищувати 100000')
  }

  let discount = 0
  if (body.discount !== undefined && body.discount !== null) {
    if (isValidDiscount(body.discount)) discount = body.discount
    else errors.push('Знижка має бути цілим числом від 0 до 90')
  }

  throwIfErrors(errors)

  return {
    title,
    genre,
    price: Math.round((price as number) * 100) / 100,
    discount,
    developer,
    image_url: imageUrl,
    description
  }
}

export function parseDiscount(raw: unknown): number {
  const body = asBody(raw)
  if (!isValidDiscount(body.discount)) {
    throw new HttpError(400, 'Знижка має бути цілим числом від 0 до 90')
  }
  return body.discount
}

export function parseCreateReview(raw: unknown): ReviewInput {
  const body = asBody(raw)
  const errors: string[] = []

  const author = readString(body, 'author', 'Автор', 50, true, errors)
  const text = readString(body, 'text', 'Текст відгуку', 2000, true, errors)

  if (typeof body.is_recommended !== 'boolean') {
    errors.push('Оцінка (is_recommended) має бути true або false')
  }

  const hours = readNumber(body, 'hours_played', 'Награні години', true, errors)
  if (hours !== null && !(hours >= 0 && hours <= 100000)) {
    errors.push('Награні години мають бути в межах від 0 до 100000')
  }

  throwIfErrors(errors)

  return {
    author,
    text,
    is_recommended: body.is_recommended as boolean,
    hours_played: Math.round((hours as number) * 10) / 10
  }
}
