<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <v-img v-bind:src="require('../assets/header/avatarExample.png')"/>
      </v-avatar>

      <v-badge class="ml-3" inline left v-if="stat==0" color="grey">
      {{pN}}
      </v-badge>

      <v-badge class="ml-3" inline left v-if="stat==1" color="blue">
      {{pN}}
      </v-badge>

      <v-badge class="ml-3" inline left v-if="stat==2" color="red">
      {{pN}}
      </v-badge>
    </v-row>
  <v-divider class="mb-1"></v-divider>
</v-container>
</template>

<script>
  export default {
    name: 'FriendDisplay',
    props: {
      pN: String,
      stat: Number,
    },
    data() {
      return {
        friends: [
          {playerName: 'Billyyyyy', avatar: '../assets/header/avatarExample.png', statut: 1} // 0 : disconnected | 1 : connected | 2 : in game
        ]
      }
    },
  }
</script>

<style scoped>
/* @import '../assets/fonts/LEMONMILK/stylesheet.css'; */


.name {
    font-family: "lemon_milkbold" !important;
    margin-left: 10px;
}

</style>