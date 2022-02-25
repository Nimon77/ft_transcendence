<template>
    <v-container  fluid class="fill-height">
    <v-row  align=center justify="center">
      <Channel :user="user" :userCR="userCR" v-on:newCR="newCR=!newCR"/>
      <Chat/>
      <PlayerChannel :userCR="userCR" :playersCR="playersCR"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

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
        user: [],
        userCR: [],
        playersCR: [],
      }
    },
    methods: {
      getPlayersCR() {
        let i = 0;

        if (this.idCR == 0)
          return (this.playersCR);

        while(i < this.userCR.items.length && this.userCR.items[i].id != this.idCR)
          i++;
        
        if (this.userCR.items[i].id == this.idCR)
          return ( this.playersCR = this.userCR.items[i].users );
        return (this.playersCR);
      },

      async fetchInfos() {
        await this.$http.get('/user/me').then((resp) => {
          this.user = resp.data;
          console.log("GET USER IN COMMUNITY ", this.user);
        })
        await this.$http.get('/user/chatroom').then((resp) => {
          this.userCR = resp.data;
          console.log("GET userCR IN COMMUNITY", this.userCR)
        })
        if (this.$route.params.idCR)
          this.idCR = this.$route.params.idCR;
        this.getPlayersCR();
      },
    },

    created() {
      this.$watch(() => this.newCR, () => {this.fetchInfos()},{ immediate: true })
      this.$watch(() => this.$route.params, () => {this.fetchInfos()},{ immediate: true })
    },

})
</script>

<style >

@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

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
