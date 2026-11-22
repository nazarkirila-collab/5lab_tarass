import { createApp } from './app.js'

const port = Number(process.env.PORT) || 3000

createApp().listen(port, () => {
  console.log(`Gabe's Workshop API: http://localhost:${port}/api/games`)
})
