import path from 'node:path'
import type { Game, Review } from '../types.js'
import { JsonFile } from './jsonFile.js'

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')

export const gamesFile = new JsonFile<Game>(path.join(DATA_DIR, 'games.json'))
export const reviewsFile = new JsonFile<Review>(path.join(DATA_DIR, 'reviews.json'))
