import cors from 'cors'
import express from 'express'
import { HttpError } from './errors.js'
import { errorHandler } from './middleware/errorHandler.js'
import { gamesRouter } from './routes/games.routes.js'
import { reviewsRouter } from './routes/reviews.routes.js'

export function createApp() {
  const app = express()

  // Middleware обов'язково підключаємо ДО маршрутів, інакше req.body буде undefined
  app.use(cors())
  app.use(express.json({ limit: '100kb' }))

  app.use('/api/games', gamesRouter)
  app.use('/api/reviews', reviewsRouter)

  app.use((_req, _res, next) => next(new HttpError(404, 'Маршрут не знайдено')))
  app.use(errorHandler)

  return app
}
