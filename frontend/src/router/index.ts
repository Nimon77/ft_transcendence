import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'
import App from '../App.vue'
import Community from '../components/community/Community.vue'
import ProfilPlayer from '../components/profilPlayer/ProfilPlayer.vue'
import Pregame from '../components/game/Pregame.vue'
import Main from '../components/Main.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/community',
    name: 'community',
    component: Community
  },
  {
    path: '/main',
    name: 'main',
    component: Main
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes : [
    {
      path: '/community',
      name: 'community',
      component: Community
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/profilPlayer',
      name: 'profilPlayer',
      component: ProfilPlayer
    },
    {
      path: '/preGame',
      name: 'preGame',
      component: Pregame
    },
  ]
})

export default router
