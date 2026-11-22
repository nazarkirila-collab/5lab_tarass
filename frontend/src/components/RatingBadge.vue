<script setup lang="ts">
import { computed } from 'vue'
import type { RatingStatus } from '../types/game'
import { RATING_VIEW } from '../utils/rating'

const props = defineProps<{ status: RatingStatus; count: number; percent: number }>()

const view = computed(() => RATING_VIEW[props.status] ?? RATING_VIEW['No Reviews'])
const hint = computed(() => (props.count > 0 ? `${props.percent}% позитивних відгуків` : 'Відгуків поки немає'))
</script>

<template>
  <span class="badge gap-1" :class="view.badgeClass" :title="hint">
    <component :is="view.icon" class="size-3.5" />
    {{ status }}
    <span class="opacity-70">({{ count }})</span>
  </span>
</template>
