import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import axios from 'axios'

import Login from '@/views/Login.vue'
import Community from '@/views/Community.vue'
import Profile from '@/views/Profile.vue'
import Pregame from '@/views/Pregame.vue'
import Game from '@/views/Game.vue'
import Main from '@/views/Main.vue'

Vue.use(VueRouter)

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/community',
    name: 'community',
    component: Community
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
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
    path: '/login',
    name: 'Login',
    component: Login,
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
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString()
    next({ name: 'Main' })
  } else if (to.name === 'Login' && isAuthenticated()) {
    next({ name: 'Main' })
  } else {
    next()
  }
})

export default router
