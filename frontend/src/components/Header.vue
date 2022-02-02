<template>
    <v-app-bar app elevation="0" height="115px" style="background: #97D490;">
        <v-app-bar-title> <v-btn class="titl" text x-large depressed max-width="150" height="32">BananaPong</v-btn> </v-app-bar-title>
        <v-spacer></v-spacer>
        <FriendButton />
        <FriendButton />
        <FriendButton />
        <Player/>
    </v-app-bar>
</template>

<script>
  import FriendButton from './FriendButton.vue'
  import Player from './Player.vue'
  export default {
    name: 'Header',
    components: {
        FriendButton,
        Player,
    },
    data() {
      return {
      }
    },
  }
</script>

<style>
@import '../assets/fonts/LEMONMILK/stylesheet.css';

.titl {
  font-family: "lemon_milkmedium";
  color: white !important;
  transform: scale(2);
  margin-left: 60px;
}
</style>