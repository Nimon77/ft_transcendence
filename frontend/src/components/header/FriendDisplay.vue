<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-auth-image="'/user/'+ user.id +'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==0" color="grey">
      {{user.log}}
      </v-badge>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==1" color="blue">
      {{user.log}}
      </v-badge>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==2" color="red">
      {{user.log}} - in game
      </v-badge>
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{on}">
          <v-btn block class="mt-3" color="primary" dark v-on="on"> OPTIONS </v-btn>
        </template>
        <v-list class="text-center">
          <v-list-item>
            <v-list-item-title @click="toProfile">Profile Player</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Invite to Game</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Spectate</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Chat</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Remove Player</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'FriendDisplay',
    props: {
      id: {
        type: Number,
        required: true,
      }
    },
    data(): unknown {
      return {
        user: [],
        friendOptions: [
        { title: 'Profil Player' },
        { title: 'Invite to Game' },
        { title: 'Spectate' },
        { title: 'Chat' },
        { title: 'Remove Player' },
        ],
      }
    },
    methods: {
      toProfile(): void {
        console.log('GO TO PROFILE PLAYER');
        this.$router.push('/pregame'); // supprimer le dialog avec des events
      },
      async fetchFriend() {
        return (await this.$http.get('/user/' + this.id).then(response => {
          this.user = response.data; }).catch(console.log('Ressource waiting..')))
      }
    },
    created() {
      this.fetchFriend();
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
