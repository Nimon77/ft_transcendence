<template>
  <v-container>
    <v-row>
      {{ message }}
    </v-row>
    <v-row>
      <v-btn
        tile
        @click="clicked"
      >
        Accept
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';
import io from 'socket.io-client';
import router from '@/router';

export default Vue.extend({
  name: 'InvitePlayer',

  computed: {
    message() {
      return store.getters.getNotify.message;
    },
    gameSocket: {
      get() {
        return store.getters.getGameSock;
      },
      set(value: undefined) {
        store.commit('setGameSock', value);
      },
    },
    notify: {
      get() {
        return store.getters.getNotify;
      },
      set(value: undefined) {
        store.commit('setNotify', value);
      },
    },
    room: {
      get() {
        return store.getters.getGameRoom;
      },
      set(value: undefined) {
        store.commit('setGameRoom', value);
      },
    },
    socket() { return store.getters.getNotifySocket; },
    user() { return store.getters.getUser; },
  },

  methods: {
    clicked() {
      if (this.user.status !== 2) {
        this.gameSocket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/pong`, {
          transportOptions: {
            polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
          },
        });
        this.room = this.notify.roomCode;
        this.socket.emit('notify', {
          id: this.notify.sender,
          sender: store.getters.getUser.id,
          type: 'accept',
          response: true,
        });
        this.gameSocket.on('info', () => {
          this.gameSocket.emit('room', this.notify.roomCode);
          router.push('/pregame');
        })
      }
    }
  },
});
</script>
