<script setup lang="ts">
import { Plus, SlidersHorizontal } from 'lucide-vue-next'

defineProps<{ genres: string[]; selectedGenre: string }>()
const emit = defineEmits<{ select: [genre: string]; create: [] }>()
</script>

<template>
  <section class="flex flex-col gap-3 rounded-box bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
    <div class="flex flex-wrap items-center gap-2">
      <SlidersHorizontal class="size-5 text-base-content/60" aria-hidden="true" />
      <button
        type="button"
        class="btn btn-sm"
        :class="selectedGenre === '' ? 'btn-primary' : 'btn-ghost'"
        @click="emit('select', '')"
      >
        Усі жанри
      </button>
      <button
        v-for="genre in genres"
        :key="genre"
        type="button"
        class="btn btn-sm"
        :class="selectedGenre === genre ? 'btn-primary' : 'btn-ghost'"
        @click="emit('select', genre)"
      >
        {{ genre }}
      </button>
    </div>

    <button type="button" class="btn btn-primary btn-sm" @click="emit('create')">
      <Plus class="size-4" /> Нова гра
    </button>
  </section>
</template>
