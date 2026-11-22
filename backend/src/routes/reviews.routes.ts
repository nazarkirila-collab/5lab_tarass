import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import * as reviewsService from '../services/reviews.service.js'

export const reviewsRouter = Router()

reviewsRouter.delete(
  '/:review_id',
  asyncHandler(async (req, res) => {
    await reviewsService.deleteReview(req.params.review_id)
    res.status(204).end()
  })
)
