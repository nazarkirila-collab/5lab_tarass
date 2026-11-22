import { baseApi } from '../api/baseApi'
import type { CreateGameBody, GameWithStats } from '../types/game'

export const gamesService = {
  list: (genre?: string) => baseApi.get<GameWithStats[]>('/games', { params: genre ? { genre } : undefined }),

  getById: (id: string) => baseApi.get<GameWithStats>(`/games/${encodeURIComponent(id)}`),

  create: (body: CreateGameBody) => baseApi.post<GameWithStats>('/games', body),

  setDiscount: (id: string, discount: number) =>
    baseApi.patch<GameWithStats>(`/games/${encodeURIComponent(id)}/discount`, { discount }),

  remove: (id: string) => baseApi.delete(`/games/${encodeURIComponent(id)}`)
}
