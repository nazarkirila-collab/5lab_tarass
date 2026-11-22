import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { gamesService } from '../services/games.service'
import { reviewsService } from '../services/reviews.service'
import { useToastStore } from '../stores/toast.store'
import type { CreateReviewBody, GameWithStats, Review } from '../types/game'
import { hasStatus } from '../utils/errors'

/** Composable сторінки гри: сама гра, її відгуки та дії над ними. */
export function useGameDetails(gameId: MaybeRefOrGetter<string>) {
  const toast = useToastStore()

  const game = ref<GameWithStats | null>(null)
  const reviews = ref<Review[]>([])
  const isLoading = ref(false)
  const notFound = ref(false)
  const loadFailed = ref(false)
  const isSubmitting = ref(false)
  const isSaving = ref(false)
  let loadToken = 0

  async function load(): Promise<void> {
    const id = toValue(gameId)
    const token = ++loadToken

    isLoading.value = true
    notFound.value = false
    loadFailed.value = false
    game.value = null
    reviews.value = []

    try {
      const [loadedGame, loadedReviews] = await Promise.all([gamesService.getById(id), reviewsService.listByGame(id)])
      if (token !== loadToken) return
      game.value = loadedGame
      reviews.value = loadedReviews
    } catch (error) {
      if (token !== loadToken) return
      notFound.value = hasStatus(error, 404)
      loadFailed.value = !notFound.value
    } finally {
      if (token === loadToken) isLoading.value = false
    }
  }

  /** Оновлює гру (рейтинг, ціна) з сервера без перезавантаження сторінки. */
  async function refreshGame(id: string): Promise<void> {
    try {
      const fresh = await gamesService.getById(id)
      if (id === toValue(gameId)) game.value = fresh
    } catch {
      // повідомлення покаже interceptor
    }
  }

  async function addReview(body: CreateReviewBody): Promise<boolean> {
    if (isSubmitting.value) return false
    const id = toValue(gameId)
    isSubmitting.value = true

    try {
      const created = await reviewsService.create(id, body)
      if (id === toValue(gameId)) reviews.value = [created, ...reviews.value]
      toast.success('Відгук опубліковано')
    } catch {
      return false
    } finally {
      isSubmitting.value = false
    }

    await refreshGame(id)
    return true
  }

  async function removeReview(reviewId: string): Promise<boolean> {
    if (isSaving.value) return false
    const id = toValue(gameId)
    isSaving.value = true

    try {
      await reviewsService.remove(reviewId)
      reviews.value = reviews.value.filter((review) => review.id !== reviewId)
      toast.success('Відгук видалено')
    } catch {
      return false
    } finally {
      isSaving.value = false
    }

    await refreshGame(id)
    return true
  }

  async function updateDiscount(discount: number): Promise<boolean> {
    if (isSaving.value) return false
    isSaving.value = true

    try {
      const updated = await gamesService.setDiscount(toValue(gameId), discount)
      game.value = updated
      toast.success(discount > 0 ? `Знижку змінено: -${discount}%` : 'Знижку прибрано')
      return true
    } catch {
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function removeGame(): Promise<boolean> {
    if (isSaving.value || !game.value) return false
    const title = game.value.title
    isSaving.value = true

    try {
      await gamesService.remove(toValue(gameId))
      toast.success(`Гру «${title}» видалено разом з відгуками`)
      return true
    } catch {
      return false
    } finally {
      isSaving.value = false
    }
  }

  watch(() => toValue(gameId), load, { immediate: true })

  return {
    game, reviews, isLoading, notFound, loadFailed, isSubmitting, isSaving,
    load, addReview, removeReview, updateDiscount, removeGame
  }
}
