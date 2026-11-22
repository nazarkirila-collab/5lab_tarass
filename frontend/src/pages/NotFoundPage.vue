<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-box bg-base-100 py-16 text-center">
    <SearchX class="size-10 text-base-content/40" />
    <p class="text-lg font-semibold">Сторінку не знайдено</p>
    <RouterLink :to="{ name: 'home' }" class="btn btn-primary btn-sm">До каталогу</RouterLink>
  </div>
</template>
