<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean; title: string; wide?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const box = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      box.value?.querySelector<HTMLElement>('input, textarea, select')?.focus()
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="modal" :class="{ 'modal-open': modelValue }" role="dialog" aria-modal="true" :aria-label="title">
    <div ref="box" class="modal-box" :class="wide ? 'w-11/12 max-w-2xl' : ''">
      <slot />
    </div>
    <div class="modal-backdrop" @click="close"></div>
  </div>
</template>
