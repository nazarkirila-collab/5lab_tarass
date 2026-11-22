<script setup lang="ts">
import type { Component } from 'vue'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next'
import { useToastStore, type ToastType } from '../stores/toast.store'

const toastStore = useToastStore()

const VIEW: Record<ToastType, { alertClass: string; icon: Component }> = {
  info: { alertClass: 'alert-info', icon: Info },
  success: { alertClass: 'alert-success', icon: CircleCheck },
  warning: { alertClass: 'alert-warning', icon: TriangleAlert },
  error: { alertClass: 'alert-error', icon: CircleAlert }
}
</script>

<template>
  <!-- z-index вищий за модальні вікна DaisyUI (999), щоб помилки сервера було видно і над формою -->
  <TransitionGroup
    tag="div"
    class="toast toast-top toast-end z-[1100]"
    enter-active-class="transition duration-300"
    enter-from-class="translate-x-8 opacity-0"
    leave-active-class="transition duration-200"
    leave-to-class="translate-x-8 opacity-0"
    move-class="transition duration-300"
  >
    <div v-for="toast in toastStore.toasts" :key="toast.id" role="alert" class="alert max-w-xs" :class="VIEW[toast.type].alertClass">
      <component :is="VIEW[toast.type].icon" class="size-5 shrink-0" />
      <span>{{ toast.message }}</span>
      <button type="button" class="btn btn-ghost btn-xs btn-square" aria-label="Закрити" @click="toastStore.dismiss(toast.id)">
        <X class="size-4" />
      </button>
    </div>
  </TransitionGroup>
</template>
