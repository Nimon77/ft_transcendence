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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
