<script setup lang="ts">
import { ref, watch } from 'vue'
import { ImageOff } from 'lucide-vue-next'

const props = defineProps<{ src: string; alt: string }>()
const failed = ref(false)

watch(() => props.src, () => (failed.value = false))
</script>

<template>
  <img v-if="src && !failed" :src="src" :alt="alt" loading="lazy" class="object-cover" @error="failed = true" />
  <div v-else class="flex items-center justify-center bg-base-300 text-base-content/40" role="img" :aria-label="alt">
    <ImageOff class="size-10" />
  </div>
</template>
