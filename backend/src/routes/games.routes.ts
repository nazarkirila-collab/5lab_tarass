import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import * as gamesService from '../services/games.service.js'
import * as reviewsService from '../services/reviews.service.js'

export const gamesRouter = Router()

gamesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await gamesService.listGames(req.query.genre))
  })
)

gamesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await gamesService.getGame(req.params.id))
  })
)

gamesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await gamesService.createGame(req.body))
  })
)

gamesRouter.patch(
  '/:id/discount',
  asyncHandler(async (req, res) => {
    res.json(await gamesService.setDiscount(req.params.id, req.body))
  })
)

gamesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await gamesService.deleteGame(req.params.id)
    res.status(204).end()
  })
)

gamesRouter.get(
  '/:id/reviews',
  asyncHandler(async (req, res) => {
    res.json(await reviewsService.listForGame(req.params.id))
  })
)

gamesRouter.post(
  '/:id/reviews',
  asyncHandler(async (req, res) => {
    res.status(201).json(await reviewsService.createReview(req.params.id, req.body))
  })
)
