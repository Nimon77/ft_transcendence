<template>
    <v-container fluid class="fill-height">
    <v-row class="fill-height" align="start" justify="center">
      <Channel :socket="socket" :CRs="CRs" :userCR="userCR" v-on:fetchCR="fetchCR=!fetchCR"/>
      <Chat :socket="socket" v-bind:idCR="idCR" />
      <PlayerChannel :socket="socket" :playersCR="playersCR" v-bind:isOwner="isOwner" :admins="playerAdmins" :isAdmin="isAdmin"/>
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
        fetchCR: false,
        socket: {},
        socketData: [],
        isOwner: false,
        isAdmin: false,
        user: [],
        playerAdmins: [],
      }
    },
    computed: {
      idCR: {
        get() {
          return this.$store.getters.getIdCR;
        },
        set(value) {
          this.$store.commit('setIdCR', value);
        }
      },
      CRs: {
        get() {
          return this.$store.getters.getCRs;
        },
        set(value) {
          this.$store.commit('setCRs', value);
        }
      },
      userCR: {
        get() {
          return this.$store.getters.getUserCR;
        },
        set(value) {
          this.$store.commit('setUserCR', value);
        }
      },
      playersCR: {
        get() {
          return this.$store.getters.getPlayersCR;
        },
        set(value) {
          this.$store.commit('setPlayersCR', value);
        }
      },
    },
    methods: {
      getPlayersCR() {
        
        if (this.idCR == 0)
          return (this.playersCR = []);

        if (!this.userCR.find(CR => CR.id == this.idCR)) {
          this.idCR = 0;
          return (this.playersCR = []);
        }
        console.log(this.userCR.find(CR => CR.id == this.idCR));
        this.playersCR = [];
        this.userCR.forEach(CR => {
          if (CR.id == this.idCR) {
            this.playersCR = CR.users;
            this.isOwner = CR.ownerId == this.user.id;
            this.playerAdmins = CR.adminId;
            this.isAdmin = CR.adminId.find(id => id == this.user.id) != undefined;
          }
        });
      },

      fetchInfos() {
        this.$http.get('/user/me').then((resp) => {
          this.user = resp.data;
          // console.log("GET USER IN COMMUNITY ", this.user); // TODO: remove
        })
        this.$http.get('/channel').then((resp) => {
          this.CRs = resp.data;
          // console.log("/channel", this.CRs); // TODO: remove
        })
        this.$http.get('/channel/me').then((resp) => {
          this.userCR = resp.data;
          // console.log("/channel/me", this.userCR) // TODO: remove
        })

        if (this.userCR != undefined)
          this.getPlayersCR();
      },
      fetchSocket()
      {
        this.socket.on("info", data => {
          this.socketData = data;
          this.user = data.user;
          this.userCR = data.channels;
          if (this.userCR != undefined)
            this.getPlayersCR();
        });
      },
    },

    created() {
      this.socket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/chat`, {
        transportOptions: {
          polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
        },
      });
      this.fetchSocket();
      this.$watch(() => this.fetchCR, () => {this.fetchInfos()},{ immediate: true })
      this.$watch(() => this.idCR, () => {this.fetchInfos()},{ immediate: true })

      this.socket.on('mute', data => {
        console.log("MUTE", data);
        if (data.muted_user.id == this.user.id) {
          const message = data.is_muted ? "You have been muted by " + data.user.username : "You have been unmuted by " + data.user.username;
          this.$toast.warning(message, {
            position: POSITION.TOP_RIGHT,
            timeout: 5000,
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
          });
        }
        this.fetchInfos();
      });
      this.socket.on('ban', data => {
        if (data.banned_user.id == this.user.id) {
          this.$toast.error("You have been banned by " + data.user.username, {
            position: "top-right",
            timeout: 5000,
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
          });
        }
        this.fetchInfos();
      });
      this.socket.on("admin", () => {
        this.fetchInfos();
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
