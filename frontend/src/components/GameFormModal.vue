<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import type { CreateGameBody } from '../types/game'
import { validateGameForm, type FormErrors, type GameFormValues } from '../utils/validation'
import BaseModal from './BaseModal.vue'

const props = defineProps<{ modelValue: boolean; genres: string[]; isSaving: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [body: CreateGameBody] }>()

const emptyForm = (): GameFormValues => ({
  title: '',
  genre: '',
  price: '',
  discount: 0,
  developer: '',
  image_url: '',
  description: ''
})

const form = reactive<GameFormValues>(emptyForm())
const errors = ref<FormErrors>({})

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    Object.assign(form, emptyForm())
    errors.value = {}
  }
)

function submit() {
  errors.value = validateGameForm(form)
  if (Object.keys(errors.value).length > 0) return

  emit('submit', {
    title: form.title.trim(),
    genre: form.genre.trim(),
    price: Number(form.price),
    discount: Number(form.discount || 0),
    developer: form.developer.trim(),
    image_url: form.image_url.trim(),
    description: form.description.trim()
  })
}
</script>

<template>
  <BaseModal :model-value="modelValue" wide title="Нова гра" @update:model-value="emit('update:modelValue', $event)">
    <h3 class="text-lg font-bold">Нова гра</h3>

    <form class="grid gap-x-4 gap-y-1 py-4 sm:grid-cols-2" novalidate @submit.prevent="submit">
      <fieldset class="fieldset sm:col-span-2">
        <legend class="fieldset-legend">Назва</legend>
        <input v-model="form.title" class="input w-full" :class="{ 'input-error': errors.title }" placeholder="Cinder Crawler" />
        <p v-if="errors.title" class="label text-error">{{ errors.title }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Жанр</legend>
        <input
          v-model="form.genre"
          list="genre-options"
          class="input w-full"
          :class="{ 'input-error': errors.genre }"
          placeholder="Roguelike"
        />
        <datalist id="genre-options">
          <option v-for="genre in genres" :key="genre" :value="genre"></option>
        </datalist>
        <p v-if="errors.genre" class="label text-error">{{ errors.genre }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Розробник</legend>
        <input v-model="form.developer" class="input w-full" :class="{ 'input-error': errors.developer }" />
        <p v-if="errors.developer" class="label text-error">{{ errors.developer }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Базова ціна ($)</legend>
        <input
          v-model="form.price"
          type="number"
          min="0"
          step="0.01"
          class="input w-full"
          :class="{ 'input-error': errors.price }"
          placeholder="14.99"
        />
        <p v-if="errors.price" class="label text-error">{{ errors.price }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Знижка (0–90%)</legend>
        <input
          v-model="form.discount"
          type="number"
          min="0"
          max="90"
          step="1"
          class="input w-full"
          :class="{ 'input-error': errors.discount }"
        />
        <p v-if="errors.discount" class="label text-error">{{ errors.discount }}</p>
      </fieldset>

      <fieldset class="fieldset sm:col-span-2">
        <legend class="fieldset-legend">Посилання на обкладинку</legend>
        <input
          v-model="form.image_url"
          type="url"
          class="input w-full"
          :class="{ 'input-error': errors.image_url }"
          placeholder="https://example.com/cover.jpg"
        />
        <p v-if="errors.image_url" class="label text-error">{{ errors.image_url }}</p>
      </fieldset>

      <fieldset class="fieldset sm:col-span-2">
        <legend class="fieldset-legend">Опис</legend>
        <textarea
          v-model="form.description"
          rows="4"
          class="textarea w-full"
          :class="{ 'textarea-error': errors.description }"
        ></textarea>
        <p v-if="errors.description" class="label text-error">{{ errors.description }}</p>
      </fieldset>

      <div class="modal-action sm:col-span-2">
        <button type="button" class="btn btn-ghost" :disabled="isSaving" @click="emit('update:modelValue', false)">
          <X class="size-4" /> Скасувати
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
          <Plus v-else class="size-4" />
          Створити гру
        </button>
      </div>
    </form>
  </BaseModal>
</template>
