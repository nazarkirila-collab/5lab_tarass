<script setup lang="ts">
import { computed } from 'vue'
import { formatPrice, getFinalPrice } from '../utils/format'

const props = defineProps<{ price: number; discount: number; large?: boolean }>()

const finalPrice = computed(() => getFinalPrice(props.price, props.discount))
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-if="discount > 0">
      <span class="badge badge-success font-bold" :class="large ? 'badge-lg' : ''">-{{ discount }}%</span>
      <span class="text-base-content/50 line-through" :class="large ? 'text-lg' : 'text-sm'">{{ formatPrice(price) }}</span>
      <span class="font-bold text-success" :class="large ? 'text-3xl' : 'text-xl'">{{ formatPrice(finalPrice) }}</span>
    </template>
    <span v-else class="font-bold" :class="large ? 'text-3xl' : 'text-xl'">{{ formatPrice(price) }}</span>
  </div>
</template>
