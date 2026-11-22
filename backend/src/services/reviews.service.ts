import { randomUUID } from 'node:crypto'
import { HttpError } from '../errors.js'
import { withLock } from '../storage/lock.js'
import { gamesFile, reviewsFile } from '../storage/store.js'
import type { Review } from '../types.js'
import { parseCreateReview } from '../validation.js'

const gameNotFound = () => new HttpError(404, 'Гру не знайдено')

export async function listForGame(gameId: string): Promise<Review[]> {
  return withLock(async () => {
    const [games, reviews] = await Promise.all([gamesFile.read(), reviewsFile.read()])
    if (!games.some((game) => game.id === gameId)) throw gameNotFound()

    return reviews
      .filter((review) => review.game_id === gameId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  })
}

export async function createReview(gameId: string, body: unknown): Promise<Review> {
  return withLock(async () => {
    const games = await gamesFile.read()
    if (!games.some((game) => game.id === gameId)) throw gameNotFound()

    const data = parseCreateReview(body)
    const reviews = await reviewsFile.read()
    const review: Review = {
      id: randomUUID(),
      game_id: gameId,
      ...data,
      created_at: new Date().toISOString()
    }
    reviews.push(review)
    await reviewsFile.write(reviews)
    return review
  })
}

export async function deleteReview(reviewId: string): Promise<void> {
  return withLock(async () => {
    const reviews = await reviewsFile.read()
    if (!reviews.some((review) => review.id === reviewId)) {
      throw new HttpError(404, 'Відгук не знайдено')
    }
    await reviewsFile.write(reviews.filter((review) => review.id !== reviewId))
  })
}
