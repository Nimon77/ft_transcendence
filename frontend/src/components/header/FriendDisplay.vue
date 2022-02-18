<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <!-- <v-img src="https://upload.wikimedia.org/wikipedia/commons/5/56/Paloma_brav%C3%ADa_%28Columba_livia%29%2C_Palacio_de_Nymphenburg%2C_M%C3%BAnich%2C_Alemania01.JPG"/> -->
        <img v-auth-image="'http://localhost:3000/user/5/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left v-if="stat==0" color="grey">
      {{pN}} - disconnected
      </v-badge>

      <v-badge class="ml-3" inline left v-if="stat==1" color="blue">
      {{pN}} - connected
      </v-badge>

      <v-badge class="ml-3" inline left v-if="stat==2" color="red">
      {{pN}} - in game
      </v-badge>
    </v-row>
  <v-divider class="mb-1"></v-divider>
</v-container>
</template>

<script lang="ts">
  export default {
    name: 'FriendDisplay',
    props: {
      pN: String,
      stat: Boolean,
    },
    data(): unknown {
      return {
        
      }
    },
    methods: {      
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