<template>
    <v-card flat tile min-width="18%" class="d-flex flex-column" height="80%">
      <v-sheet color="green" min-height="100" dark width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> PLAYERS </span>
      </v-sheet>
      <v-list v-if="idCR != 0">
        <div class="d-flex justify-left">
        <v-list-item-content  class="mt-n4 ml-4 yellow--text text-h6">
          <v-list-item-title> <v-badge dot inline :color="status(user.status)"> </v-badge> {{user.username}} </v-list-item-title>
        </v-list-item-content>
        </div>
        <v-divider></v-divider>
        <div v-for="player in playersCR" :key="player.id">
        <v-list-group v-if="player.id != user.id">
          <template v-slot:activator>
            <v-list-item-content class="mt-n4">
              <v-list-item-title> <v-badge dot inline :color="status(user.status)"> </v-badge> {{player.username}} </v-list-item-title>
            </v-list-item-content>

          </template>

          <v-list-item dense>
              <v-list-item-title class="d-flex justify-center text-button">
                <v-btn color="yellow darken-1" tile dark min-width="100%" @click="invite(player.id)"> INVITE </v-btn>
              </v-list-item-title>
          </v-list-item>
          <v-list-item dense>
              <v-list-item-title class="d-flex justify-center text-button">
                <v-btn color="blue" tile dark min-width="100%"> DIRECT MSG </v-btn>
              </v-list-item-title>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn router :to="'/profile/' + player.id" color="blue" tile dark min-width="100%"> PROFILE </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item dense v-if="isAdmin">
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn @click="mutePlayer(player.id)" color="red" tile dark min-width="50%" >{{isPlayerMuted(player.id)}}</v-btn>
              <v-btn @click="banPlayer(player.id)" color="red" class="ml-1" tile dark min-width="50%" >{{isPlayerBanned(player.id)}}</v-btn>
            </v-list-item-title>
          </v-list-item>                <!-- MUTE BAN FOR AMOUNT OF TIME!! -->
          <v-list-item dense v-if="isOwner">
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn @click="setAdmin(player.id)" color="blue" tile dark min-width="100%" >
                <div id="admin">{{isPlayerAdmin(player.id)}}</div>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-divider></v-divider>
      </div>
      </v-list>
      <v-sheet v-else color="grey" height="100%" dark width="100%" class="text-center">
      </v-sheet>
    </v-card>

</template>


<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
    name: 'PlayerChannel',
    props: {
      socket: {},
      playersCR: [],
      isOwner: Boolean,
      isAdmin: Boolean,
      admins: [],
      idCR: Number,
    },
    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      userCR() {
        return this.$store.getters.getUserCR;
      },
    },
    methods: {
      isPlayerMuted(idPlayer) {
        if (this.userCR.find(CR => CR.id == this.idCR).muted.find(muted => muted.userId == idPlayer))
          return 'UNMUTE';
        return 'MUTE';
      },
      isPlayerBanned(idPlayer) {
        if (this.userCR.find(CR => CR.id == this.idCR).banned.find(banned => banned.userId == idPlayer))
          return 'UNBAN';
        return 'BAN';
      },
      isPlayerAdmin(idPlayer) {
        if (this.admins.indexOf(idPlayer) == -1)
          return "SET ADMIN";
        else
          return "UNSET ADMIN";
      },

      mutePlayer(idPlayer) {
        this.socket.emit('mute', {userId: idPlayer, roomId: this.idCR})
      },
      banPlayer (idPlayer) {
        this.socket.emit('ban', {userId: idPlayer, roomId: this.idCR});
      },
      setAdmin(idPlayer) {
        this.socket.emit('admin', {userId: idPlayer, roomId: this.idCR});
      },

      invite(id: number) {
        const payload = {
          id: id,
          data: {
            message: this.user.username + " has invited you to play",
          }
        };
        this.$socket.emit('notify', payload);
      },

      status(status: number) {
        if (status == 1)
          return 'blue';
        else if (status == 2)
          return 'orange';
        else if (status == 3)
          return 'green';
        else
          return 'grey';
      }
    },
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.v-list {
  display: flex !important;
  flex-direction: column;
  overflow: auto;
}
</style>
