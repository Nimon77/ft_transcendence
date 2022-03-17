import Vue from 'vue';
import Vuex from 'vuex';
import { POSITION } from 'vue-toastification';

import InvitePlayer from '@/components/InvitePlayer.vue';
import { Socket } from 'socket.io-client';

import IUser from '@/models/IUser';
import IGameOptions from '@/models/IGameOptions';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: <IUser>{
      id: null,
      username: '',
      avatarId: null,
      rank: null,
      status: null,
      profileCompleted: false,
      otp: '',
      blocked: [],
      friends: [],
    },
    avatar: null,
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

    gameSock: Socket,
    gameRoom: '',
    gameOptions: <IGameOptions>{},
    usersInGame: <Array<IUser>>[],
  },
  getters: {
    getReady: state => state.ready,
    getUser: state => state.user,
    getAvatar: state => state.avatar,
    getMessage: state => state.message,
    getIdCR: state => state.chat.idCR,
    getCRs: state => state.chat.CRs,
    getUserCR: state => state.chat.userCR,
    getPlayersCR: state => state.chat.playersCR,
    getGameSock: state => state.gameSock,
    getGameRoom: state => state.gameRoom,
    getGameOptions: state => state.gameOptions,
    getUsersInGame: state => state.usersInGame,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAvatar(state, avatar) {
      state.avatar = avatar;
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
      state.gameSock = gameSock;
    },
    setGameRoom(state, gameRoom) {
      state.gameRoom = gameRoom;
    },
    setGameOptions(state, gameOptions) {
      console.log('gameOptions', gameOptions);
      state.gameOptions = gameOptions;
    },
    setUsersInGame(state, users) {
      state.usersInGame = users;
    },
    'NOTIFY_notify': (state, payload) => {
      state.message = payload;
      console.log(state.message); // TODO: remove
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
