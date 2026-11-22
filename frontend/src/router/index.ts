import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/games/:id', name: 'game', component: () => import('../pages/GameDetailsPage.vue'), props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../pages/NotFoundPage.vue') }
  ],
  scrollBehavior: () => ({ top: 0 })
})
