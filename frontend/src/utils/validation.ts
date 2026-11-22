export type FormErrors = Record<string, string>

export interface GameFormValues {
  title: string
  genre: string
  price: number | ''
  discount: number | ''
  developer: string
  image_url: string
  description: string
}

export interface ReviewFormValues {
  author: string
  is_recommended: boolean | null
  hours_played: number | ''
  text: string
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateGameForm(values: GameFormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.title.trim()) errors.title = 'Вкажіть назву гри'
  else if (values.title.trim().length > 100) errors.title = 'Максимум 100 символів'

  if (!values.genre.trim()) errors.genre = 'Вкажіть жанр'
  else if (values.genre.trim().length > 50) errors.genre = 'Максимум 50 символів'

  if (values.price === '' || !Number.isFinite(values.price)) errors.price = 'Вкажіть ціну'
  else if (values.price <= 0) errors.price = 'Ціна має бути більшою за 0'
  else if (values.price > 100000) errors.price = 'Ціна не може перевищувати 100000'

  if (values.discount !== '') {
    if (!Number.isInteger(values.discount) || values.discount < 0 || values.discount > 90) {
      errors.discount = 'Знижка — ціле число від 0 до 90'
    }
  }

  if (values.developer.trim().length > 100) errors.developer = 'Максимум 100 символів'

  const imageUrl = values.image_url.trim()
  if (imageUrl && !isHttpUrl(imageUrl)) errors.image_url = 'Вкажіть коректне посилання (http або https)'

  if (values.description.trim().length > 2000) errors.description = 'Максимум 2000 символів'

  return errors
}

export function validateReviewForm(values: ReviewFormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.author.trim()) errors.author = "Вкажіть ім'я або нікнейм"
  else if (values.author.trim().length > 50) errors.author = 'Максимум 50 символів'

  if (values.is_recommended === null) errors.is_recommended = 'Оберіть оцінку'

  if (values.hours_played === '' || !Number.isFinite(values.hours_played)) errors.hours_played = 'Вкажіть кількість годин'
  else if (values.hours_played < 0) errors.hours_played = 'Години не можуть бути від’ємними'
  else if (values.hours_played > 100000) errors.hours_played = 'Занадто велике значення'

  if (!values.text.trim()) errors.text = 'Напишіть текст відгуку'
  else if (values.text.trim().length > 2000) errors.text = 'Максимум 2000 символів'

  return errors
}
