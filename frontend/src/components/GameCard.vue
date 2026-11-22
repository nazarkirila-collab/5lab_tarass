<script setup lang="ts">
import { Building2, Percent, Trash2 } from 'lucide-vue-next'
import type { GameWithStats } from '../types/game'
import CoverImage from './CoverImage.vue'
import PriceBlock from './PriceBlock.vue'
import RatingBadge from './RatingBadge.vue'

const props = defineProps<{ game: GameWithStats }>()
const emit = defineEmits<{ discount: [game: GameWithStats]; remove: [game: GameWithStats] }>()
</script>

<template>
  <article class="card bg-base-100 shadow-sm">
    <RouterLink :to="{ name: 'game', params: { id: props.game.id } }" class="block" :aria-label="props.game.title">
      <CoverImage :src="props.game.image_url" :alt="props.game.title" class="aspect-video w-full rounded-t-box" />
    </RouterLink>

    <div class="card-body gap-3 p-4">
      <div>
        <h3 class="card-title text-lg">
          <RouterLink :to="{ name: 'game', params: { id: props.game.id } }" class="link link-hover">
            {{ props.game.title }}
          </RouterLink>
        </h3>
        <p class="flex items-center gap-1 text-sm text-base-content/70">
          <Building2 class="size-4 shrink-0" aria-hidden="true" />
          {{ props.game.developer || 'Розробник не вказаний' }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="badge badge-outline">{{ props.game.genre }}</span>
        <RatingBadge
          :status="props.game.rating_status"
          :count="props.game.reviews_count"
          :percent="props.game.positive_percent"
        />
      </div>

      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <PriceBlock :price="props.game.price" :discount="props.game.discount" />
        <div class="flex shrink-0 gap-1">
          <div class="tooltip" data-tip="Змінити знижку">
            <button
              type="button"
              class="btn btn-ghost btn-square btn-sm"
              aria-label="Змінити знижку"
              @click="emit('discount', props.game)"
            >
              <Percent class="size-4" />
            </button>
          </div>
          <div class="tooltip" data-tip="Видалити гру">
            <button
              type="button"
              class="btn btn-ghost btn-square btn-sm text-error"
              aria-label="Видалити гру"
              @click="emit('remove', props.game)"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
