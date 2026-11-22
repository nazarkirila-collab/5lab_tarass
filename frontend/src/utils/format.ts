const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const dateTime = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' })

export function formatPrice(value: number): string {
  return money.format(value)
}

export function getFinalPrice(price: number, discount: number): number {
  return Math.round(price * (100 - discount)) / 100
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateTime.format(date)
}

export function formatHours(hours: number): string {
  return `${hours.toLocaleString('uk-UA')} год`
}
