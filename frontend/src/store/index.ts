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
      avatar: null,
      friends: []
    },
    ready: false,

    message: {
      id: Number,
      data: {
        message: String,
      }
    },

    chat: {
      idCR: 0,
      CRs: {},
      userCR: {},
      playersCR: {},
    },

    gameSock: [],
    gameRoom: '',
  },
  getters: {
    getReady: state => state.ready,
    getUser: state => state.user,
    getMessage: state => state.message,
    getIdCR: state => state.chat.idCR,
    getCRs: state => state.chat.CRs,
    getUserCR: state => state.chat.userCR,
    getPlayersCR: state => state.chat.playersCR,
    getGameSock: state => state.gameSock,
    getGameRoom: state => state.gameRoom,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setReady(state, ready) {
      state.ready = ready;
    },
    setIdCR(state, idCR) {
      state.chat.idCR = idCR;
    },
    setCRs(state, CRs) {
      state.chat.CRs = CRs;
    },
    setUserCR(state, userCR) {
      state.chat.userCR = userCR;
    },
    setPlayersCR(state, playersCR) {
      state.chat.playersCR = playersCR;
    },
    setGameSock(state, gameSock) {
      // console.log("SET gameSOCK");
      state.gameSock = gameSock;
    },
    setGameRoom(state, gameRoom) {
      // console.log("SET gameROOM", gameRoom);
      state.gameRoom = gameRoom;
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
