<script setup lang="ts">
import { Trash2, X } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'

defineProps<{ modelValue: boolean; title: string; message: string; confirmText: string; isLoading: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [] }>()
</script>

<template>
  <BaseModal :model-value="modelValue" :title="title" @update:model-value="emit('update:modelValue', $event)">
    <h3 class="text-lg font-bold">{{ title }}</h3>
    <p class="py-4 text-base-content/80">{{ message }}</p>
    <div class="modal-action">
      <button type="button" class="btn btn-ghost" :disabled="isLoading" @click="emit('update:modelValue', false)">
        <X class="size-4" /> Скасувати
      </button>
      <button type="button" class="btn btn-error" :disabled="isLoading" @click="emit('confirm')">
        <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
        <Trash2 v-else class="size-4" />
        {{ confirmText }}
      </button>
    </div>
  </BaseModal>
</template>
