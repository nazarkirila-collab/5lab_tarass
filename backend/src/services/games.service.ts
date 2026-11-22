import { randomUUID } from 'node:crypto'
import { HttpError } from '../errors.js'
import { withLock } from '../storage/lock.js'
import { gamesFile, reviewsFile } from '../storage/store.js'
import type { GameWithStats } from '../types.js'
import { parseCreateGame, parseDiscount } from '../validation.js'
import { groupByGame, withStats } from './rating.js'

const notFound = () => new HttpError(404, 'Гру не знайдено')

function parseGenreQuery(value: unknown): string {
  if (value === undefined) return ''
  if (typeof value !== 'string') throw new HttpError(400, 'Параметр genre має бути рядком')
  return value.trim().toLowerCase()
}

export async function listGames(genreQuery: unknown): Promise<GameWithStats[]> {
  const genre = parseGenreQuery(genreQuery)

  return withLock(async () => {
    const [games, reviews] = await Promise.all([gamesFile.read(), reviewsFile.read()])
    const byGame = groupByGame(reviews)
    const filtered = genre ? games.filter((game) => game.genre.toLowerCase() === genre) : games
    return filtered.map((game) => withStats(game, byGame.get(game.id) ?? []))
  })
}

export async function getGame(id: string): Promise<GameWithStats> {
  return withLock(async () => {
    const [games, reviews] = await Promise.all([gamesFile.read(), reviewsFile.read()])
    const game = games.find((item) => item.id === id)
    if (!game) throw notFound()
    return withStats(game, reviews.filter((review) => review.game_id === id))
  })
}

export async function createGame(body: unknown): Promise<GameWithStats> {
  const data = parseCreateGame(body)

  return withLock(async () => {
    const games = await gamesFile.read()
    const game = { id: randomUUID(), ...data }
    games.push(game)
    await gamesFile.write(games)
    return withStats(game, [])
  })
}

export async function setDiscount(id: string, body: unknown): Promise<GameWithStats> {
  return withLock(async () => {
    const [games, reviews] = await Promise.all([gamesFile.read(), reviewsFile.read()])
    const game = games.find((item) => item.id === id)
    if (!game) throw notFound()

    game.discount = parseDiscount(body)
    await gamesFile.write(games)
    return withStats(game, reviews.filter((review) => review.game_id === id))
  })
}

/** Каскадне видалення: спочатку відгуки гри, потім сама гра. */
export async function deleteGame(id: string): Promise<void> {
  return withLock(async () => {
    const games = await gamesFile.read()
    if (!games.some((game) => game.id === id)) throw notFound()

    const reviews = await reviewsFile.read()
    await reviewsFile.write(reviews.filter((review) => review.game_id !== id))
    await gamesFile.write(games.filter((game) => game.id !== id))
  })
}
