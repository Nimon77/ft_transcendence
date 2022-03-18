<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-if="user.id !== undefined" v-auth-image="'/user/'+ user.id +'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left :color="status">
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
            <v-list-item-title @click="spectate">Spectate</v-list-item-title>
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
import io from 'socket.io-client';

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
        status: 'grey',
      }
    },
    methods: {
      spectate() {
        console.log("spectate");
        // vérifier que le user n'est pas deja in game
        if (this.status != 'orange') {
          this.socket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/pong`, {
              transportOptions: {
              polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
              },
          });
          this.$store.commit('setGameSock', this.socket);
          this.$store.getters.getGameSock.on('info', (data) => {
              console.log('Connected', data); // TODO: remove
              this.socket.emit('room'); // RAJOUTER LE CODE DE LA ROOM
          });
          this.socket.on('room', (code) => {
              this.dialog = false;
              console.log(`room ${code} created`); // TODO: remove
              this.$store.commit('setGameRoom', code);
              this.$router.push('/pregame');
          });
          return;
        }
      },

      toProfile() {
        this.$emit("closedialog");
        if (this.$route.path !== '/profile/' + this.user.id)
          this.$router.push('/profile/' + this.user.id);
      },
      removeFriend() {
        this.$emit("rmFriend", this.user.id);
      },

      getStatusColor(status: number) {
        if (status == 1)
          return 'green';
        else if (status == 2)
          return 'orange';
        else if (status == 3)
          return 'green';
        else
          return 'grey';
      },

      async fetchFriend() {
        return (await this.$http.get('/user/' + this.id).then(response => {
          this.user = response.data;
          this.status = this.getStatusColor(this.user.status);
          console.log('STATUS', this.status); // TODO: remove
        }))
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
