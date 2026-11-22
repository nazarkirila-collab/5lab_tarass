<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Send, ThumbsDown, ThumbsUp } from 'lucide-vue-next'
import type { CreateReviewBody } from '../types/game'
import { validateReviewForm, type FormErrors, type ReviewFormValues } from '../utils/validation'

defineProps<{ isSubmitting: boolean }>()
const emit = defineEmits<{ submit: [body: CreateReviewBody] }>()

const form = reactive<ReviewFormValues>({ author: '', is_recommended: null, hours_played: '', text: '' })
const errors = ref<FormErrors>({})

function submit() {
  errors.value = validateReviewForm(form)
  if (Object.keys(errors.value).length > 0) return

  emit('submit', {
    author: form.author.trim(),
    is_recommended: form.is_recommended === true,
    hours_played: Number(form.hours_played),
    text: form.text.trim()
  })
}

/** Викликається батьком після успішної публікації; автора залишаємо для наступних відгуків. */
function reset() {
  form.is_recommended = null
  form.hours_played = ''
  form.text = ''
  errors.value = {}
}

defineExpose({ reset })
</script>

<template>
  <form class="card bg-base-100 shadow-sm" novalidate @submit.prevent="submit">
    <div class="card-body gap-1">
      <h3 class="card-title">Написати відгук</h3>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Автор</legend>
        <input v-model="form.author" class="input w-full" :class="{ 'input-error': errors.author }" placeholder="Нікнейм" />
        <p v-if="errors.author" class="label text-error">{{ errors.author }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Оцінка</legend>
        <div class="join w-full">
          <button
            type="button"
            class="btn join-item flex-1"
            :class="form.is_recommended === true ? 'btn-success' : ''"
            :aria-pressed="form.is_recommended === true"
            @click="form.is_recommended = true"
          >
            <ThumbsUp class="size-4" /> Рекомендую
          </button>
          <button
            type="button"
            class="btn join-item flex-1"
            :class="form.is_recommended === false ? 'btn-error' : ''"
            :aria-pressed="form.is_recommended === false"
            @click="form.is_recommended = false"
          >
            <ThumbsDown class="size-4" /> Не рекомендую
          </button>
        </div>
        <p v-if="errors.is_recommended" class="label text-error">{{ errors.is_recommended }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Награно годин</legend>
        <input
          v-model="form.hours_played"
          type="number"
          min="0"
          step="0.1"
          class="input w-full"
          :class="{ 'input-error': errors.hours_played }"
        />
        <p v-if="errors.hours_played" class="label text-error">{{ errors.hours_played }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Текст відгуку</legend>
        <textarea
          v-model="form.text"
          rows="4"
          maxlength="2000"
          class="textarea w-full"
          :class="{ 'textarea-error': errors.text }"
        ></textarea>
        <p v-if="errors.text" class="label text-error">{{ errors.text }}</p>
      </fieldset>

      <button type="submit" class="btn btn-primary mt-2" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
        <Send v-else class="size-4" />
        Опублікувати відгук
      </button>
    </div>
  </form>
</template>
