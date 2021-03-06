import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/regl',
      name: 'regl',
      component: () => import('./views/Regl.vue')
    },
    {
      path: '/single',
      name: 'single',
      component: () => import('./views/SingleTile.vue')
    },
    {
      path: '/multiple',
      name: 'multiple',
      component: () => import('./views/MultipleTiles.vue')
    },
    {
      path: '/map-view',
      name: 'map-view',
      component: () => import('./views/MapView.vue')
    }
  ]
})
