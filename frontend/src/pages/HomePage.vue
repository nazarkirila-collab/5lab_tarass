<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RefreshCw, SearchX, TriangleAlert } from 'lucide-vue-next'
import ConfirmModal from '../components/ConfirmModal.vue'
import DiscountModal from '../components/DiscountModal.vue'
import FilterPanel from '../components/FilterPanel.vue'
import GameCard from '../components/GameCard.vue'
import GameFormModal from '../components/GameFormModal.vue'
import { useGames } from '../composables/useGames'
import type { CreateGameBody, GameWithStats } from '../types/game'

const { games, genres, selectedGenre, isLoading, error, isSaving, fetchGames, setGenre, createGame, updateDiscount, removeGame } =
  useGames()

const showForm = ref(false)
const gameToDiscount = ref<GameWithStats | null>(null)
const gameToDelete = ref<GameWithStats | null>(null)

const discountOpen = computed({
  get: () => gameToDiscount.value !== null,
  set: (open) => {
    if (!open) gameToDiscount.value = null
  }
})

const deleteOpen = computed({
  get: () => gameToDelete.value !== null,
  set: (open) => {
    if (!open) gameToDelete.value = null
  }
})

onMounted(() => fetchGames(games.value.length > 0))

async function handleCreate(body: CreateGameBody) {
  if (await createGame(body)) showForm.value = false
}

async function handleDiscount(discount: number) {
  const target = gameToDiscount.value
  if (target && (await updateDiscount(target.id, discount))) gameToDiscount.value = null
}

async function handleDelete() {
  const target = gameToDelete.value
  if (target && (await removeGame(target.id, target.title))) gameToDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <FilterPanel :genres="genres" :selected-genre="selectedGenre" @select="setGenre" @create="showForm = true" />

    <div v-if="error" role="alert" class="alert alert-error">
      <TriangleAlert class="size-5" />
      <span>{{ error }}. Перевірте, чи запущений бекенд.</span>
      <button type="button" class="btn btn-sm" @click="fetchGames()"><RefreshCw class="size-4" /> Повторити</button>
    </div>

    <div v-if="isLoading && !games.length" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="n in 6" :key="n" class="skeleton h-80 w-full"></div>
    </div>

    <div v-else-if="games.length" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <GameCard v-for="game in games" :key="game.id" :game="game" @discount="gameToDiscount = $event" @remove="gameToDelete = $event" />
    </div>

    <div v-else-if="!error" class="flex flex-col items-center gap-3 rounded-box bg-base-100 py-16 text-center">
      <SearchX class="size-10 text-base-content/40" />
      <p class="text-lg font-semibold">У каталозі немає ігор{{ selectedGenre ? ` у жанрі «${selectedGenre}»` : '' }}</p>
      <p class="text-base-content/60">Додайте першу гру, щоб вона з'явилась у вітрині.</p>
      <button type="button" class="btn btn-primary btn-sm" @click="showForm = true">Нова гра</button>
    </div>

    <GameFormModal v-model="showForm" :genres="genres" :is-saving="isSaving" @submit="handleCreate" />
    <DiscountModal v-model="discountOpen" :game="gameToDiscount" :is-saving="isSaving" @save="handleDiscount" />
    <ConfirmModal
      v-model="deleteOpen"
      title="Видалити гру?"
      :message="`Гру «${gameToDelete?.title ?? ''}» буде видалено разом з усіма її відгуками. Цю дію не можна скасувати.`"
      confirm-text="Видалити"
      :is-loading="isSaving"
      @confirm="handleDelete"
    />
  </div>
</template>
