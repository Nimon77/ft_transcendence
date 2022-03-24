import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import store from '@/store';

Vue.use(VueRouter)

function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Main',
    component: lazyLoad('Main'),
  },
  {
    path: '/community',
    name: 'community',
    component: lazyLoad('Community'),
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: lazyLoad('Profile'),
  },
  {
    path: '/preGame',
    name: 'preGame',
    component: lazyLoad('Pregame'),
  },
  {
    path: '/game',
    name: 'game',
    component: lazyLoad('Game'),
  },
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('Login'),
  },
  {
    path: '/otp',
    name: 'Otp',
    component: lazyLoad('Otp'),
  },
  {
    path: '/updateprofile',
    name: 'UpdateProfile',
    component: lazyLoad('UpdateProfile'),
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
    OTP: false,
  }
  const token = localStorage.getItem('token')
  status.loggedIn = token !== null
  if (token) {
    status.OTP = (jwt_decode(token) as JWT).otp;
    if (!status.OTP)
      return status;
    await axios.get('/auth/jwt', {
      headers: {
        Authorization: 'Bearer ' + token
    }}).then(res => {
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
          status.OTP = false;
          localStorage.removeItem('token');
          store.commit('setReady', false);
        }
      }
    }
  }
  return status;
}

interface JWT {
  exp: number,
  iat: number,
  otp: boolean,
  sub: string,
}

router.beforeEach((to, from, next) => {
  document.title = "BananaPong";
  checkJWT().then(Status => {
    if (Status.JWTvalide && (store.getters.getNotifySocket === null || !store.getters.getNotifySocket.connected)) {
      store.dispatch('connectNotify');
    }
    if (to.name === 'Login' && to.query.code !== undefined) {
      localStorage.setItem('token', to.query.code.toString());
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
      const decoded = jwt_decode(to.query.code.toString()) as JWT;
      if (decoded.otp === false) {
        return next({ name: 'Otp' });
      }
      axios.get("/user/me").then(res => {
        store.commit('setUser', res.data);
        if (res.data.profileCompleted) {
          store.commit('setReady', true);
          axios.get("/user/me/avatar", { responseType: 'arraybuffer' }).then(res => {
            const avatar = "data:image/*" + ";base64," + Buffer.from(res.data).toString('base64')
            store.commit('setAvatar', avatar);
          });
          return next({ name: 'Main' });
        }
        else {
          store.commit('setReady', false);
          return next({ name: 'UpdateProfile' });
        }
      });
    }
    else if (to.name === 'Otp' && !Status.OTP) {
      return next();
    }
    else if (to.name === 'Otp' && Status.OTP) {
      return next({ name: 'Login' });
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
      axios.get("/user/me/avatar", { responseType: 'arraybuffer' }).then(res => {
        const avatar = "data:image/*" + ";base64," + Buffer.from(res.data).toString('base64')
        store.commit('setAvatar', avatar);
      });
    }
    if (store.state.ready === false && Status.JWTvalide && Status.ProfileCompleted && to.name !== 'Login') {
      store.commit('setReady', true);
    }

    // mmaj
    // prevent user to get manually to pregame and game
    if ((to.name === 'preGame' || to.name === 'game') && !store.state.gameRoom.length) {
      return next({ name: 'Main'});
    }
    next();
  });
})

export default router
