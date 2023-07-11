import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/:appdirectory/test-key',
      component: () => import('@/components/HardwarkeyTest')
    },
    {
      path: '/404',
      component: () => import('@/components/ErrorPage')
    },
    {
      path: '/',
      component: () => import('@/components/Login')
    },
    {
      path: '/:appdirectory',
      component: () => import('@/components/Login')
    },
    {
      path: '/:appdirectory/signup',
      component: () => import('@/components/Signup')
    },
    {
      path: '/:appdirectory/dashboard',
      component: () => import('@/components/Dashboard')
    },
    { path: '/:pathMatch(.*)*', component: () => import('@/components/ErrorPage') }
  ]
})

export default router;