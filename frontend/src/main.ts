import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { setupInterceptors } from './api/interceptors'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
setupInterceptors()
app.mount('#app')
