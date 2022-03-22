import Vue from 'vue';
import Vuex from 'vuex';
import { POSITION } from 'vue-toastification';

import InvitePlayer from '@/components/InvitePlayer.vue';
import { io, Socket } from 'socket.io-client';

import IUser from '@/models/IUser';
import IGameOptions from '@/models/IGameOptions';
import IChannel from '@/models/IChannel';

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
      followed: [],
    },
    avatar: null,
    ready: false,

    notifySocket: <Socket> null,
    notify: {
      id: Number,
      message: String,
    },

    status: [{id: Number, status: Number}],

    chat: {
      socket: <Socket> null,
      idCurrentChannel: 0,
      currentChannel: <IChannel> {},
      channels: {},
      myChannels: {},
    },

    gameSock: <Socket> null,
    gameRoom: '',
    gameOptions: <IGameOptions>{},
    usersInGame: <Array<IUser>>[],
  },
  getters: {
    getReady: state => state.ready,
    getUser: state => state.user,
    getAvatar: state => state.avatar,
    getNotifySocket: state => state.notifySocket,
    getNotify: state => state.notify,
    getStatus: state => state.status,
    getChatSocket: state => state.chat.socket,
    getIdCurrentChannel: state => state.chat.idCurrentChannel,
    getCurrentChannel: state => state.chat.currentChannel,
    getChannels: state => state.chat.channels,
    getMyChannels: state => state.chat.myChannels,
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
    setChatSocket(state, socket) {
      state.chat.socket = socket;
    },
    setIdCurrentChannel(state, idCurrentChannel) {
      state.chat.idCurrentChannel = idCurrentChannel;
    },
    setCurrentChannel(state, currentChannel) {
      state.chat.currentChannel = currentChannel;
    },
    setChannels(state, channels) {
      state.chat.channels = channels;
    },
    setMyChannels(state, myChannels) {
      state.chat.myChannels = myChannels;
    },
    setGameSock(state, gameSock) {
      state.gameSock = gameSock;
    },
    setGameRoom(state, gameRoom) {
      state.gameRoom = gameRoom;
    },
    setGameOptions(state, gameOptions) {
      state.gameOptions = gameOptions;
    },
    setUsersInGame(state, users) {
      state.usersInGame = users;
    },
    'NOTIFY_notify': (state, payload) => {
      if (payload.type === undefined) {
        state.notify = payload;
        console.log(state.notify); // TODO: remove
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
      }
    },
    'NOTIFY_status': (state, payload) => {
      if (payload.userId == state.user.id) {
        state.user.status = payload.status;
      }
      if (state.chat.idCurrentChannel != 0 &&
        state.chat.socket.connected &&
        state.chat.currentChannel.users &&
        state.chat.currentChannel.users.some(user => user.id == payload.userId)) {
        state.chat.currentChannel.users.find(user => user.id == payload.userId).status = payload.status;
      }
    }
  },
  actions: {
    connectNotify({ commit }) {
      this.state.notifySocket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/notify`, {
        transportOptions: {
          polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
        },
      });
      this.state.notifySocket.on('notify', (data) => {
        commit('NOTIFY_notify', data);
      });
      this.state.notifySocket.on('status', (data) => {
        commit('NOTIFY_status', data);
      });
    }
  },
  modules: {
  },
});
