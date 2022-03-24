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
      myChannels: {
        get() {
          return this.$store.getters.getMyChannels;
        },
        set(channels: unknown) {
          this.$store.commit('setMyChannels', channels);
        }
      },
      channels: {
        get() {
          return this.$store.getters.getChannels;
        },
        set(channels: unknown) {
          this.$store.commit('setChannels', channels);
        }
      },
      directChannels: {
        get() {
          return this.$store.getters.getDirectChannels;
        },
        set(channels: unknown) {
          this.$store.commit('setDirectChannels', channels);
        }
      },
    },

    methods: {
      fetchChannelsList() {
        this.$http.get('/channel').then(response => {
          this.channels = response.data;
        });
        if (this.socket.connected)
          this.socket.emit('channelMe');
      }
    },

    created() {
      this.socket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/chat`, {
        transportOptions: {
          polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
        },
      });
      this.$watch(() => this.fetchChannels, () => {this.fetchChannelsList()}, { immediate: true });
      this.socket.on("info", (data) => {
        this.myChannels = data.channels_user;
        this.channels = data.channels_all;
        this.directChannels = data.dmChannel;
      });

      this.socket.on("channelMe", (data) => {
        this.myChannels = data;
      })
      this.socket.on("channelMeDM", (data) => {
        this.directChannels = data;
      })

      this.socket.on('join', () => {
        this.fetchChannelsList();
      });
      this.socket.on('joinDM', () => {
        this.socket.emit('channelMeDM');
      });
      this.socket.on('leave', (data) => {
        if (this.idCurrentChannel === data.channel.id && (data.user.id === this.user.id || data.is_delete === true))
          this.idCurrentChannel = 0;
        this.fetchChannelsList();
      });
      this.socket.on('mute', data => {
        if (data.muted_user.id == this.user.id) {
          const message = data.channel.muted.some(mute => mute.user.id === this.user.id) ?
            "You have been muted from " + data.channel.name + " by " + data.user.username :
            "You have been unmuted from " + data.channel.name + " by " + data.user.username;
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
        this.myChannels.find(channel => channel.id == data.channel.id).muted = data.channel.muted;
      });
      this.socket.on('ban', data => {
        if (data.banned_user.id == this.user.id) {
          this.$toast.error("You have been banned from " + data.channel.name + " by " + data.user.username, {
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
          if (this.idCurrentChannel == data.channel.id)
            this.idCurrentChannel = 0;
        }
        this.fetchChannelsList();
      });
      this.socket.on("admin", (data) => {
        if (data.admin_user.id == this.user.id) {
          const message = data.channel.admin.includes(this.user.id) ?
            "You are now an admin of " + data.channel.name :
            "You are no longer an admin of " + data.channel.name;
          this.$toast.success(message, {
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
        this.myChannels.find(channel => channel.id == data.channel.id).adminId = data.channel.admin;
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
