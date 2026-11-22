<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Building2, Percent, RefreshCw, SearchX, Trash2, TriangleAlert } from 'lucide-vue-next'
import ConfirmModal from '../components/ConfirmModal.vue'
import CoverImage from '../components/CoverImage.vue'
import DiscountModal from '../components/DiscountModal.vue'
import PriceBlock from '../components/PriceBlock.vue'
import RatingBadge from '../components/RatingBadge.vue'
import ReviewForm from '../components/ReviewForm.vue'
import ReviewList from '../components/ReviewList.vue'
import { useGameDetails } from '../composables/useGameDetails'
import type { CreateReviewBody, Review } from '../types/game'

const props = defineProps<{ id: string }>()
const router = useRouter()

const { game, reviews, isLoading, notFound, loadFailed, isSubmitting, isSaving, load, addReview, removeReview, updateDiscount, removeGame } =
  useGameDetails(() => props.id)

const reviewForm = ref<InstanceType<typeof ReviewForm> | null>(null)
const showDiscount = ref(false)
const showDeleteGame = ref(false)
const reviewToDelete = ref<Review | null>(null)

const deleteReviewOpen = computed({
  get: () => reviewToDelete.value !== null,
  set: (open) => {
    if (!open) reviewToDelete.value = null
  }
})

async function handleReview(body: CreateReviewBody) {
  if (await addReview(body)) reviewForm.value?.reset()
}

async function handleDiscount(discount: number) {
  if (await updateDiscount(discount)) showDiscount.value = false
}

async function handleDeleteGame() {
  if (await removeGame()) {
    showDeleteGame.value = false
    await router.push({ name: 'home' })
  }
}

async function handleDeleteReview() {
  const target = reviewToDelete.value
  if (target && (await removeReview(target.id))) reviewToDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <RouterLink :to="{ name: 'home' }" class="btn btn-ghost btn-sm"><ArrowLeft class="size-4" /> До каталогу</RouterLink>

    <div v-if="isLoading" class="space-y-6">
      <div class="skeleton h-72 w-full"></div>
      <div class="skeleton h-40 w-full"></div>
    </div>

    <div v-else-if="notFound" class="flex flex-col items-center gap-3 rounded-box bg-base-100 py-16 text-center">
      <SearchX class="size-10 text-base-content/40" />
      <p class="text-lg font-semibold">Гру не знайдено</p>
      <p class="text-base-content/60">Можливо, її вже видалили з каталогу.</p>
      <RouterLink :to="{ name: 'home' }" class="btn btn-primary btn-sm">Повернутися до каталогу</RouterLink>
    </div>

    <div v-else-if="loadFailed" role="alert" class="alert alert-error">
      <TriangleAlert class="size-5" />
      <span>Не вдалося завантажити гру. Перевірте, чи запущений бекенд.</span>
      <button type="button" class="btn btn-sm" @click="load"><RefreshCw class="size-4" /> Повторити</button>
    </div>

    <template v-else-if="game">
      <section class="card overflow-hidden bg-base-100 shadow-sm lg:card-side">
        <CoverImage :src="game.image_url" :alt="game.title" class="aspect-video w-full lg:w-1/2" />

        <div class="card-body gap-4 lg:w-1/2">
          <div>
            <h1 class="text-3xl font-bold">{{ game.title }}</h1>
            <p class="mt-1 flex items-center gap-1 text-base-content/70">
              <Building2 class="size-4" aria-hidden="true" /> {{ game.developer || 'Розробник не вказаний' }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span class="badge badge-outline">{{ game.genre }}</span>
            <RatingBadge :status="game.rating_status" :count="game.reviews_count" :percent="game.positive_percent" />
          </div>

          <p class="whitespace-pre-line text-base-content/80">{{ game.description || 'Опису поки немає.' }}</p>

          <PriceBlock :price="game.price" :discount="game.discount" large />

          <div class="card-actions mt-auto">
            <button type="button" class="btn btn-outline btn-sm" @click="showDiscount = true">
              <Percent class="size-4" /> Змінити знижку
            </button>
            <button type="button" class="btn btn-outline btn-error btn-sm" @click="showDeleteGame = true">
              <Trash2 class="size-4" /> Видалити гру
            </button>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div class="space-y-4">
          <div class="flex flex-wrap items-end justify-between gap-2">
            <h2 class="text-2xl font-bold">Огляди гравців ({{ game.reviews_count }})</h2>
            <p v-if="game.reviews_count > 0" class="text-sm text-base-content/70">{{ game.positive_percent }}% позитивних</p>
          </div>

          <progress
            v-if="game.reviews_count > 0"
            class="progress progress-success w-full"
            :value="game.positive_percent"
            max="100"
          ></progress>

          <ReviewList v-if="reviews.length" :reviews="reviews" @remove="reviewToDelete = $event" />

          <div v-else class="rounded-box bg-base-100 p-8 text-center text-base-content/60">
            Оглядів поки немає. Напишіть перший.
          </div>
        </div>

        <div class="lg:sticky lg:top-20 lg:self-start">
          <ReviewForm ref="reviewForm" :is-submitting="isSubmitting" @submit="handleReview" />
        </div>
      </section>

      <DiscountModal v-model="showDiscount" :game="game" :is-saving="isSaving" @save="handleDiscount" />
      <ConfirmModal
        v-model="showDeleteGame"
        title="Видалити гру?"
        :message="`Гру «${game.title}» буде видалено разом з усіма її відгуками. Цю дію не можна скасувати.`"
        confirm-text="Видалити"
        :is-loading="isSaving"
        @confirm="handleDeleteGame"
      />
      <ConfirmModal
        v-model="deleteReviewOpen"
        title="Видалити відгук?"
        :message="`Відгук автора «${reviewToDelete?.author ?? ''}» буде видалено, а рейтинг гри перераховано.`"
        confirm-text="Видалити"
        :is-loading="isSaving"
        @confirm="handleDeleteReview"
      />
    </template>
  </div>
</template>
