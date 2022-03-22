<template>
    <v-container fluid class="fill-height">
    <v-row class="fill-height" align="start" justify="center">
      <Channel :socket="socket" v-on:fetchChannels="fetchChannels = !fetchChannels"/>
      <Chat :socket="socket"/>
      <PlayerChannel :socket="socket"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import io from "socket.io-client";
import { POSITION } from "vue-toastification";

import Chat from '@/components/community/Chat.vue'
import Channel from '@/components/community/Channel.vue'
import PlayerChannel from '@/components/community/PlayerChannel.vue'

Vue.component('Chat', Chat);
Vue.component('Channel', Channel);
Vue.component('PlayerChannel', PlayerChannel);

export default Vue.extend({
    name: 'Community',

    data() {
      return {
        fetchChannels: false,
      }
    },

    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      socket: {
        get() {
          return this.$store.getters.getChatSocket;
        },
        set(socket: unknown) {
          this.$store.commit('setChatSocket', socket);
        }
      },
      idCurrentChannel: {
        get() {
          return this.$store.getters.getIdCurrentChannel;
        },
        set(id: number) {
          this.$store.commit('setIdCurrentChannel', id);
        }
      },
      currentChannel: {
        get() {
          return this.$store.getters.getCurrentChannel;
        },
        set(channel: unknown) {
          this.$store.commit('setCurrentChannel', channel);
        }
      },
      myChannels: {
        get() {
          return this.$store.getters.getMyChannels;
        },
        set(channels: unknown) {
          this.$store.commit('setMyChannels', channels);
        }
      },
    },

    methods: {
      fetchCurrentChannelInfos() {
        if (this.idCurrentChannel != 0) {
          this.$http.get('/channel/' + this.idCurrentChannel).then(response => {
            this.currentChannel = response.data;
          });
        }
      },
      fetchChannelsList() {
        this.$http.get('/channel').then(response => {
          this.$store.commit('setChannels', response.data);
        });
        this.$http.get('/channel/me').then(response => {
          this.myChannels = response.data;
        });
        this.fetchCurrentChannelInfos();
      }
      
    },

    created() {
      this.socket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/chat`, {
        transportOptions: {
          polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
        },
      });
      this.$watch(() => this.fetchChannels, () => {this.fetchChannelsList()}, { immediate: true });
      this.$watch(() => this.idCurrentChannel, () => {this.fetchChannelsList()}, { immediate: true });
      this.socket.on("info", () => {
        this.fetchCurrentChannelInfos();
      });

      this.socket.on('join', (data) => {
        console.log('JOIN', data); // TODO: remove
        if (data.user.id == this.user.id)
          this.idCurrentChannel = data.channel.id;
        this.fetchChannelsList();
      });
      this.socket.on('leave', (data) => {
        console.log('LEAVE', data); // TODO: remove
        if (this.idCurrentChannel == data.channel.id && data.user.id == this.user.id)
          this.idCurrentChannel = 0;
        this.fetchChannelsList();
      });
      this.socket.on('mute', data => {
        if (data.muted_user.id == this.user.id) {
          const message = data.is_muted ? "You have been muted by " + data.user.username : "You have been unmuted by " + data.user.username;
          this.$toast.warning(message, {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
        this.fetchCurrentChannelInfos();
      });
      this.socket.on('ban', data => {
        if (data.banned_user.id == this.user.id) {
          this.$toast.error("You have been banned by " + data.user.username, {
            position: "top-right",
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
        this.fetchChannelsList();
      });
      this.socket.on("admin", () => {
        this.fetchChannelsList();
      });
    },
    beforeRouteLeave(to, from, next) {
      this.socket.disconnect();
      next();
    }
})
</script>

<style >
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

html, body {
  overflow: hidden !important;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.span {
  font-family: "lemon_milkmedium";
  font-size: 30px;
  letter-spacing: 0.1em;
  /* margin-left: 60px; */
}

.btn:hover {
    transform: scale(1.1)
}

</style>
