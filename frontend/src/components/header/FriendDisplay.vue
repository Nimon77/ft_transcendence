<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-if="user.id !== undefined" v-auth-image="'/user/'+ user.id +'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left color="blue">
      {{user.username}}
      </v-badge>
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{on}">
          <v-btn class="mt-3" color="primary" dark v-on="on"> OPTIONS </v-btn>
        </template>
        <v-list class="text-center">
          <v-list-item @click="toProfile">
            <v-list-item-title>Profile Player</v-list-item-title>
          </v-list-item>
          <v-list-item @click="invite">
            <v-list-item-title>Invite to Game</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Spectate</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Chat</v-list-item-title>
          </v-list-item>
          <v-list-item @click="removeFriend">
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
      },
      me: []
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
      toProfile() {
        console.log(this.$route.path, '/profile/' + this.user.id);
        this.$emit("closedialog");
        if (this.$route.path !== '/profile/' + this.user.id)
          this.$router.push('/profile/' + this.user.id); // supprimer le dialog avec des events
      },
      
      removeFriend() {
        this.$emit("rmFriend", this.user.id);
      },
      
      async fetchFriend() {
        return (await this.$http.get('/user/' + this.id).then(response => {
          this.user = response.data; }).catch(console.log('Ressource waiting..')))
      },

      invite() {
        const payload = {
          id: this.user.id,
          data: {
            message: this.me.username + " has invited you to play",
          }
        };
        this.$socket.emit('notify', payload);
      },
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
