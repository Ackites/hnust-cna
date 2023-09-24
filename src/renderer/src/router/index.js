import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@renderer/layout/index.vue'
import Tray from '@renderer/components/tray/index.vue'

const constantRoutes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@renderer/views/index.vue')
      }
    ]
  },
  {
    path: '/tray',
    component: Tray
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
