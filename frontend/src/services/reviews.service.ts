import { baseApi } from '../api/baseApi'
import type { CreateReviewBody, Review } from '../types/game'

export const reviewsService = {
  listByGame: (gameId: string) => baseApi.get<Review[]>(`/games/${encodeURIComponent(gameId)}/reviews`),

  create: (gameId: string, body: CreateReviewBody) =>
    baseApi.post<Review>(`/games/${encodeURIComponent(gameId)}/reviews`, body),

  remove: (reviewId: string) => baseApi.delete(`/reviews/${encodeURIComponent(reviewId)}`)
}
