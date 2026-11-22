import type { Game, GameWithStats, RatingStatus, Review } from '../types.js'

export function getRatingStatus(count: number, positivePercent: number): RatingStatus {
  if (count === 0) return 'No Reviews'
  if (positivePercent >= 95) return 'Overwhelmingly Positive'
  if (positivePercent >= 70) return 'Positive'
  if (positivePercent >= 40) return 'Mixed'
  return 'Negative'
}

export function withStats(game: Game, reviews: Review[]): GameWithStats {
  const count = reviews.length
  const positive = reviews.filter((review) => review.is_recommended).length
  const percent = count === 0 ? 0 : Math.round((positive / count) * 100)

  return {
    ...game,
    reviews_count: count,
    positive_percent: percent,
    rating_status: getRatingStatus(count, percent)
  }
}

export function groupByGame(reviews: Review[]): Map<string, Review[]> {
  const map = new Map<string, Review[]>()
  for (const review of reviews) {
    const list = map.get(review.game_id)
    if (list) list.push(review)
    else map.set(review.game_id, [review])
  }
  return map
}
