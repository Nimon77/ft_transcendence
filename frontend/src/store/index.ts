import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: '',
  },
  mutations: {
    'NOTIFY_notify': (state, payload) => {
      Vue.$toast("notif from user " + payload.id + ": " + payload.data.message);
      state.message = payload
      console.log(state.message)
    }
  },
  actions: {
    'NOTIFY_NEW_MESSAGE'({ commit }, message) {
      commit('NOTIFY_NEW_MESSAGE', message);
    }
  },
  modules: {
  },
});
