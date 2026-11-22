import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { gamesService } from '../services/games.service'
import { useGamesStore } from '../stores/games.store'
import { useToastStore } from '../stores/toast.store'
import type { CreateGameBody } from '../types/game'

/** Composable каталогу: міст між компонентами, Pinia-стором і сервісом. */
export function useGames() {
  const store = useGamesStore()
  const toast = useToastStore()
  const { games, genres, selectedGenre, isLoading, error } = storeToRefs(store)

  const isSaving = ref(false)

  async function fetchGames(silent = false): Promise<void> {
    const requestId = store.beginRequest()
    const genre = store.selectedGenre

    if (!silent) store.setLoading(true)
    store.setError(null)

    try {
      const list = await gamesService.list(genre || undefined)
      if (!store.isLatest(requestId)) return
      store.applyList(list, genre)
    } catch {
      if (!store.isLatest(requestId)) return
      store.setError('Не вдалося завантажити каталог')
    } finally {
      if (store.isLatest(requestId)) store.setLoading(false)
    }
  }

  function setGenre(genre: string): Promise<void> {
    store.setSelectedGenre(genre)
    return fetchGames()
  }

  async function runSaving(action: () => Promise<void>): Promise<boolean> {
    if (isSaving.value) return false
    isSaving.value = true
    try {
      await action()
      return true
    } catch {
      return false // повідомлення про помилку вже показав response interceptor
    } finally {
      isSaving.value = false
    }
  }

  const createGame = (body: CreateGameBody) =>
    runSaving(async () => {
      const created = await gamesService.create(body)
      toast.success(`Гру «${created.title}» додано`)
      await fetchGames(true)
    })

  const updateDiscount = (id: string, discount: number) =>
    runSaving(async () => {
      const updated = await gamesService.setDiscount(id, discount)
      store.upsert(updated)
      toast.success(discount > 0 ? `Знижку на «${updated.title}» змінено: -${discount}%` : `Знижку на «${updated.title}» прибрано`)
    })

  const removeGame = (id: string, title: string) =>
    runSaving(async () => {
      await gamesService.remove(id)
      toast.success(`Гру «${title}» видалено разом з відгуками`)
      await fetchGames(true)
    })

  return {
    games, genres, selectedGenre, isLoading, error, isSaving,
    fetchGames, setGenre, createGame, updateDiscount, removeGame
  }
}
