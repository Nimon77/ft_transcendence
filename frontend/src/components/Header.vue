<template>
    <v-app-bar app elevation="0" height="115px" style="background-color: #97D490;">
        <!-- <v-app-bar-title> -->
          <v-btn
            class="titl"
            x-large depressed text
            width="400" height="60">
            BananaPong
          </v-btn>
        <!-- </v-app-bar-title> -->
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
  font-size: 44px !important;
  color: white !important;
  /* margin-left: 60px; */
}
</style>