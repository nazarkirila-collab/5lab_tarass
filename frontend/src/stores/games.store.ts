import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameWithStats } from '../types/game'

export const useGamesStore = defineStore('games', () => {
  const _games = ref<GameWithStats[]>([])
  const _genres = ref<string[]>([])
  const _selectedGenre = ref('')
  const _isLoading = ref(false)
  const _error = ref<string | null>(null)
  let latestRequestId = 0

  const games = computed(() => _games.value)
  const genres = computed(() => _genres.value)
  const selectedGenre = computed(() => _selectedGenre.value)
  const isLoading = computed(() => _isLoading.value)
  const error = computed(() => _error.value)

  // Захист від гонки запитів: застосовуємо лише відповідь на останній запит
  function beginRequest(): number {
    latestRequestId += 1
    return latestRequestId
  }

  function isLatest(requestId: number): boolean {
    return requestId === latestRequestId
  }

  function applyList(list: GameWithStats[], genreFilter: string) {
    _games.value = list

    // Без фільтра список жанрів беремо з повного каталогу, з фільтром — лише доповнюємо
    const pool = genreFilter ? [..._genres.value, ...list.map((game) => game.genre), genreFilter] : list.map((game) => game.genre)
    _genres.value = [...new Set(pool)].sort((a, b) => a.localeCompare(b, 'uk'))
  }

  function upsert(game: GameWithStats) {
    const index = _games.value.findIndex((item) => item.id === game.id)
    if (index !== -1) _games.value[index] = game
  }

  function setSelectedGenre(genre: string) {
    _selectedGenre.value = genre
  }

  function setLoading(value: boolean) {
    _isLoading.value = value
  }

  function setError(message: string | null) {
    _error.value = message
  }

  return {
    games, genres, selectedGenre, isLoading, error,
    beginRequest, isLatest, applyList, upsert, setSelectedGenre, setLoading, setError
  }
})
