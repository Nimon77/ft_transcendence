<template>
    <v-container fluid class="fill-height">
    <v-row class="fill-height" align="start" justify="center">
      <Channel :CRs="CRs" :user="user" :userCR="userCR" v-on:newCR="newCR=!newCR"/>
      <Chat :socket="socket" :user="user" v-bind:idCR="idCR" />
      <PlayerChannel :userCR="userCR" :playersCR="playersCR" :user="user" :idCR="idCR" v-bind:isOwner="isOwner" :admins="playerAdmins" :isAdmin="isAdmin"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import io from "socket.io-client";

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
        idCR: 0,
        newCR: false,
        socket: {},
        socketData: [],
        isOwner: false,
        isAdmin: false,
        user: [],
        userCR: [],
        playersCR: [],
        playerAdmins: [],
        CRs: [],
      }
    },
    methods: {
      
      getPlayersCR() {
        let i = 0;
        
        if (this.idCR == 0)
          return (this.playersCR = []);
        while(i < this.userCR.length && this.userCR[i].id != this.idCR)
          i++;
        if (this.userCR[i].id == this.idCR)
        {
          this.playersCR = this.userCR[i].users;
          if (this.userCR[i].ownerId == this.user.id)
            this.isOwner = true;
          else
            this.isOwner = false;
          this.playerAdmins = this.userCR[i].adminId;
          for (let j in this.userCR[i].adminId)
            if (this.userCR[i].adminId[j] == this.user.id)
            {
              this.isAdmin = true;
              return;
            }
          this.isAdmin = false;
          return;
        }
        return (this.playersCR = []);
      },

      async fetchInfos() {
        await this.$http.get('/user/me').then((resp) => {
          this.user = resp.data;
          // console.log("GET USER IN COMMUNITY ", this.user);
        })
        await this.$http.get('/channel').then((resp) => {
          this.CRs = resp.data;
          // console.log("GET CRs IN COMMUNITY ", this.CRs);
        })
        await this.$http.get('/channel/me').then((resp) => {
          this.userCR = resp.data;
          // console.log("GET userCR IN COMMUNITY", this.userCR)
        })
        if (this.$route.params.idCR)
          this.idCR = +this.$route.params.idCR;
        if (this.userCR != undefined)
          this.getPlayersCR();
      },
      fetchSocket()
      {
        this.socket.on("info", data => {
          this.socketData = data;
          this.user = data.user;
          this.userCR = data.channels;
          if (this.$route.params.idCR)
            this.idCR = +this.$route.params.idCR;
          if (this.userCR != undefined)
            this.getPlayersCR();
        });
      },
    },

    created() {
      this.socket = io("http://127.0.0.1:3000/chat", {
          transportOptions: {
          polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
          },
      });
      this.fetchSocket();
      // console.log('CREATED');
      this.$watch(() => this.newCR, () => {this.fetchInfos()},{ immediate: true })
      this.$watch(() => this.$route.params, () => {this.fetchInfos()},{ immediate: true })
    },
    mounted() {
      // console.log('MOUNTED');
        // this.socket.on("info", data => {
        //   this.socketData = data;
        //   console.log("INFO ", this.socketData);
        // });
        // this.fetchInfos();
    }
})
</script>

<style >
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';
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

// le socket marche pour un seul chat :o