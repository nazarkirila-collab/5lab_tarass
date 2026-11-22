<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Check, X } from 'lucide-vue-next'
import type { GameWithStats } from '../types/game'
import BaseModal from './BaseModal.vue'
import PriceBlock from './PriceBlock.vue'

const props = defineProps<{ modelValue: boolean; game: GameWithStats | null; isSaving: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; save: [discount: number] }>()

const PRESETS = [0, 10, 25, 50, 75, 90]

const value = ref<number | ''>(0)

watch(
  () => [props.modelValue, props.game] as const,
  ([open, game]) => {
    if (open && game) value.value = game.discount
  },
  { immediate: true }
)

const discount = computed(() => Math.min(90, Math.max(0, Math.round(Number(value.value) || 0))))
</script>

<template>
  <BaseModal :model-value="modelValue" title="Знижка на гру" @update:model-value="emit('update:modelValue', $event)">
    <h3 class="text-lg font-bold">Знижка на «{{ game?.title }}»</h3>

    <form class="space-y-4 py-4" @submit.prevent="emit('save', discount)">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Розмір знижки (0–90%)</legend>
        <div class="flex items-center gap-3">
          <input v-model.number="value" type="range" min="0" max="90" step="1" class="range range-primary range-sm flex-1" />
          <input v-model.number="value" type="number" min="0" max="90" step="1" class="input input-sm w-20" />
        </div>
      </fieldset>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in PRESETS"
          :key="preset"
          type="button"
          class="btn btn-xs"
          :class="discount === preset ? 'btn-primary' : 'btn-outline'"
          @click="value = preset"
        >
          {{ preset }}%
        </button>
      </div>

      <div v-if="game" class="rounded-box bg-base-200 p-3">
        <p class="mb-1 text-sm text-base-content/70">Так ціна виглядатиме у вітрині</p>
        <PriceBlock :price="game.price" :discount="discount" />
      </div>

      <div class="modal-action">
        <button type="button" class="btn btn-ghost" :disabled="isSaving" @click="emit('update:modelValue', false)">
          <X class="size-4" /> Скасувати
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
          <Check v-else class="size-4" />
          Зберегти знижку
        </button>
      </div>
    </form>
  </BaseModal>
</template>
