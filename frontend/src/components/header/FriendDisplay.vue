<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <!-- <v-img src="https://upload.wikimedia.org/wikipedia/commons/5/56/Paloma_brav%C3%ADa_%28Columba_livia%29%2C_Palacio_de_Nymphenburg%2C_M%C3%BAnich%2C_Alemania01.JPG"/> -->
        <img v-auth-image="'/user/'+user.id+'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==0" color="grey">
      {{user.log}} - disconnected
      </v-badge>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==1" color="blue">
      {{user.log}} - connected
      </v-badge>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==2" color="red">
      {{user.log}} - in game
      </v-badge>
    </v-row>
  <v-divider class="mb-1"></v-divider>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'FriendDisplay',
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data(): unknown {
      return {
        
      }
    },
    methods: {
    },
  })
</script>

<style scoped>
/* @import '../assets/fonts/LEMONMILK/stylesheet.css'; */


.name {
    font-family: "lemon_milkbold" !important;
    margin-left: 10px;
}

</style>
