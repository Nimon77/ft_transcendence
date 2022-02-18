<template>
  <v-app-bar app elevation="0" height="90px" color="green" clipped-left clipped-right v-if="authenticated">
    <v-btn router to="/" class="titl" x-large depressed text width="385" height="60">
      BananaPong
    </v-btn>
    <v-spacer></v-spacer>
    <FriendList class="mr-3"/>
    <Player class="ml-2"/>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

import FriendList from './FriendList.vue'
import Player from './Player.vue'

export default Vue.extend({
  name: 'Header',
  components: {
      FriendList,
      Player,
  },
  data() {
    return {
      authenticated: false,
    }
  },
  mounted() {
    this.authenticated = localStorage.getItem('token') !== null;
  },
})
</script>

<style>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.titl {
  font-family: "lemon_milkmedium";
  font-size: 44px !important;
  color: white !important;
  /* margin-left: 60px; */
}
</style>
