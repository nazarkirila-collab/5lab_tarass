import type { Component } from 'vue'
import { Meh, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-vue-next'
import type { RatingStatus } from '../types/game'

export interface RatingView {
  badgeClass: string
  icon: Component
}

export const RATING_VIEW: Record<RatingStatus, RatingView> = {
  'Overwhelmingly Positive': { badgeClass: 'badge-success', icon: ThumbsUp },
  Positive: { badgeClass: 'badge-info', icon: ThumbsUp },
  Mixed: { badgeClass: 'badge-warning', icon: Meh },
  Negative: { badgeClass: 'badge-error', icon: ThumbsDown },
  'No Reviews': { badgeClass: 'badge-ghost', icon: MessageSquare }
}
