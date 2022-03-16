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
import store from '@/store'

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
    path: '/profile/:id',
    name: 'profile',
    component: Profile,
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
    await axios.get('/auth/jwt', {
      headers: {
        Authorization: 'Bearer ' + token
    }}).then(res => {
      console.log(res); // TODO: remove
      status.JWTvalide = res.data;
    });
    if (status.JWTvalide) {
      try {
        await axios.get('/user/me', {
          headers: {
            Authorization: 'Bearer ' + token
        }}).then(me => {
          status.ProfileCompleted = me.data.profileCompleted;
        })
      } catch (error) {
        if (error.message.match('404')) {
          status.JWTvalide = false;
          status.loggedIn = false;
          status.ProfileCompleted = false;
          localStorage.removeItem('token');
          store.commit('setReady', false);
        }
      }
    }
  }
  return status;
}

router.beforeEach((to, from, next) => {
  console.log('to', to) // TODO: remove

  checkJWT().then(Status => {
    console.log('Status', Status) // TODO: remove
    if (to.name === 'Login' && to.query.code !== undefined) {
      localStorage.setItem('token', to.query.code.toString());
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
      axios.get("/user/me").then(res => {
        store.commit('setUser', res.data);
        if (res.data.profileCompleted) {
          store.commit('setReady', true);
          return next({ name: 'Main' });
        }
        else {
          store.commit('setReady', false);
          return next({ name: 'UpdateProfile' });
        }
      });
    }
    else if (to.name !== 'Login' && (!Status.loggedIn || !Status.JWTvalide)) {
      store.commit('setReady', false);
      return next({ name: 'Login' });
    }
    else if (to.name !== 'UpdateProfile' && !Status.ProfileCompleted && Status.loggedIn && Status.JWTvalide) {
      return next({ name: 'UpdateProfile' })
    }
    else if (to.name === 'Login' && Status.loggedIn && Status.JWTvalide) {
      return next({ name: 'Main' })
    }
    if (store.state.user.id === null && Status.JWTvalide) {
      axios.get("/user/me").then(res => {
        store.commit('setUser', res.data);
      });
    }
    if (store.state.ready === false && Status.JWTvalide && Status.ProfileCompleted && to.name !== 'Login') {
      store.commit('setReady', true);
    }

    // mmaj
    // prevent user to get manually to pregame and game
    // console.log("check gameROOM", store.state.gameRoom.length); // TODO: remove
    if (to.name === 'preGame' && !store.state.gameRoom.length) {
      console.log("to PREGAME"); // TODO: remove
      return next({ name: 'Main'});
    }
    if (from.name === 'preGame' && to.name !== 'game' && store.state.gameRoom.length) {
      alert("you are leaving the room!");
      store.getters.getGameSock.on('disconnect', ()=>{
        console.log("disconnected"); // TODO: remove
        store.commit('setGameRoom', '');
        store.getters.getGameSock.disconnect();
        store.getters.getGameSock.close();});
        store.getters.getGameSock.disconnect(true);
      }
    next();
  });
})

export default router
