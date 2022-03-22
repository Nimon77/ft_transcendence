<template>
  <v-app-bar app elevation="0" height="90px" color="green darken-1" clipped-left clipped-right>
    <v-btn router to="/" class="titl" x-large plain text width="385" height="60">
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
})
</script>

<style>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.v-btn--plain:not(.v-btn--active):not(.v-btn--loading):not(:focus):not(:hover) .v-btn__content {
    opacity: 1 !important;
}

.titl {
  font-family: "lemon_milkmedium";
  font-size: 44px !important;
  color: white !important;
  /* margin-left: 60px; */
}
</style>
