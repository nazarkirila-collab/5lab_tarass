<script setup lang="ts">
import { CalendarDays, Clock, ThumbsDown, ThumbsUp, Trash2, User } from 'lucide-vue-next'
import type { Review } from '../types/game'
import { formatDate, formatHours } from '../utils/format'

defineProps<{ reviews: Review[] }>()
const emit = defineEmits<{ remove: [review: Review] }>()
</script>

<template>
  <ul class="space-y-3">
    <li v-for="review in reviews" :key="review.id" class="card bg-base-100 shadow-sm">
      <div class="card-body gap-2 p-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-full bg-base-300">
              <User class="size-4" aria-hidden="true" />
            </span>
            <span class="font-semibold">{{ review.author }}</span>
          </div>

          <span class="badge gap-1" :class="review.is_recommended ? 'badge-success' : 'badge-error'">
            <ThumbsUp v-if="review.is_recommended" class="size-3.5" />
            <ThumbsDown v-else class="size-3.5" />
            {{ review.is_recommended ? 'Рекомендує' : 'Не рекомендує' }}
          </span>
        </div>

        <p class="whitespace-pre-line break-words">{{ review.text }}</p>

        <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-base-content/60">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span class="flex items-center gap-1"><Clock class="size-4" aria-hidden="true" /> {{ formatHours(review.hours_played) }}</span>
            <span class="flex items-center gap-1"><CalendarDays class="size-4" aria-hidden="true" /> {{ formatDate(review.created_at) }}</span>
          </div>

          <div class="tooltip" data-tip="Видалити відгук">
            <button
              type="button"
              class="btn btn-ghost btn-square btn-sm text-error"
              aria-label="Видалити відгук"
              @click="emit('remove', review)"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
