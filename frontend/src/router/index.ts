import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import axios from 'axios'

import Login from '@/views/Login.vue'
import Community from '@/views/Community.vue'
import Profile from '@/views/Profile.vue'
import Pregame from '@/views/Pregame.vue'
import Game from '@/views/Game.vue'
import Main from '@/views/Main.vue'
import UpdateProfile from '@/views/UpdateProfile.vue'

Vue.use(VueRouter)

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
  },
  {
    path: '/updateprofile',
    name: 'UpdateProfile',
    component: UpdateProfile,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

async function checkJWT() {
  const status = {
    loggedIn: false,
    JWTvalide: false,
    ProfileCompleted: false,
  }
  const token = localStorage.getItem('token')
  status.loggedIn = token !== null
  if (token) {
    try {
      console.log('checking token')
      return await axios.get('/user/me', {
        headers: {
          Authorization: 'Bearer ' + token
      }}).then(res => {
        console.log(res);
        status.JWTvalide = true;
        status.ProfileCompleted = res.data.profileCompleted;
        return status;
      }).catch(() => {
        return status;
      });
    }
    catch (error) {
      return status;
    }
  }
  return status;
}

router.beforeEach((to, from, next) => {
  console.log('to', to) // TODO: remove

  checkJWT().then(Status => {
    if (to.name === 'Login' && to.query.code !== undefined) {
      localStorage.setItem('token', to.query.code.toString());
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
      axios.get("/user/me").then(res => {
        if (res.data.profileCompleted) {
          localStorage.setItem('profileCompleted', 'true');
          return next({ name: 'Main' });
        }
        else {
          localStorage.setItem('profileCompleted', 'false');
          return next({ name: 'UpdateProfile' });
        }
      });
    }
    else if (to.name !== 'Login' && (!Status.loggedIn || !Status.JWTvalide)) {
      localStorage.setItem('profileCompleted', 'false');
      return next({ name: 'Login' });
    }
    else if (to.name !== 'UpdateProfile' && !Status.ProfileCompleted && Status.loggedIn && Status.JWTvalide) {
      return next({ name: 'UpdateProfile' })
    }
    else if (to.name === 'Login' && Status.loggedIn && Status.JWTvalide) {
      return next({ name: 'Main' })
    }
    next();
  });
})

export default router
