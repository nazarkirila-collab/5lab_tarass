<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="navbar sticky top-0 z-40 bg-base-100 shadow-sm">
      <div class="mx-auto flex w-full max-w-7xl items-center px-4">
        <RouterLink to="/" class="btn btn-ghost text-xl">
          <Gamepad2 class="size-6 text-primary" aria-hidden="true" />
          Gabe's Workshop
        </RouterLink>
        <span class="ml-auto hidden text-sm text-base-content/60 sm:block">Каталог інді-ігор та відгуки гравців</span>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl px-4 py-8">
      <RouterView />
    </main>

    <ToastContainer />
  </div>
</template>
