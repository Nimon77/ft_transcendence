import Vue from 'vue';
import Vuex from 'vuex';
import { POSITION } from 'vue-toastification';

import InvitePlayer from '@/components/InvitePlayer.vue';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      username: null,
      avatar: null
    },
    ready: false,

    message: {
      id: Number,
      data: {
        message: String,
      }
    },
  },
  getters: {
    getReady: state => state.ready,
    getUser: state => state.user,
    getMessage: state => state.message,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setReady(state, ready) {
      state.ready = ready;
    },
    'NOTIFY_notify': (state, payload) => {
      state.message = payload;
      console.log(state.message);
      Vue.$toast(InvitePlayer, {
        position: POSITION.TOP_LEFT,
        timeout: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false
      })
    },
  },
  actions: {
  },
  modules: {
  },
});
