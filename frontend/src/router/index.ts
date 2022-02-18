import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'
// import App from '../App.vue'
import Community from '../components/community/Community.vue'
import ProfilPlayer from '../components/profilPlayer/ProfilPlayer.vue'
import Pregame from '../components/game/Pregame.vue'
import Game from '../components/game/Game.vue'
import Main from '../components/Main.vue'

Vue.use(VueRouter)

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    component: Main
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
    path: '/profilPlayer',
    name: 'profilPlayer',
    component: ProfilPlayer
  },
  {
    path: '/preGame',
    name: 'preGame',
    component: Pregame
  },
  {
    path: '/game',
    name: 'game',
    component: Game,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  console.log('to', to) // TODO: remove
  if (to.name !== 'Login' && !isAuthenticated()) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && to.query.code !== undefined) {
    localStorage.setItem('token', to.query.code.toString())
    next({ name: 'Home' })
  } else if (to.name === 'Login' && isAuthenticated()) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
