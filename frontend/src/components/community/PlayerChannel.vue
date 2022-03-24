<template>
  <v-card dark flat tile min-width="18%" class="d-flex flex-column" height="80%">
    <v-sheet color="green" min-height="100" dark width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> PLAYERS </span>
    </v-sheet>
    <v-list v-if="idCurrentChannel != 0">
      <div class="d-flex justify-left">
        <v-list-item-content  class="mt-n4 ml-4 yellow--text text-h6">
          <v-list-item-title> <v-badge dot inline :color="status(user.status)"> </v-badge>{{user.username}}</v-list-item-title>
        </v-list-item-content>
      </div>
      <v-divider></v-divider>
      <div v-for="player in currentChannel.users" :key="player.id">
        <v-list-group v-if="player.id != user.id">
          <template v-slot:activator>
            <v-list-item-content class="mt-n4">
              <v-list-item-title> <v-badge dot inline :color="status(player.status)"> </v-badge>{{player.username}}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item dense v-if="player.status !== 2 && player.status !== 0">
            <v-dialog width="500" max-height="500" v-model="invitDialog" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-title class="d-flex justify-center text-button" v-bind="attrs" v-on="on" slot="activator" @click="invite(player.id)">
                  <v-btn color="yellow darken-1" tile dark min-width="100%"> INVITE TO GAME </v-btn>
                </v-list-item-title>
              </template>
              <v-card dark>
                <v-card-title>
                  <div style="margin-left: 120px">
                    <h3 class="headline">Waiting for player...</h3>
                    <div style="margin-left: 95px; margin-top: 30px; margin-bottom: 20px;"> <v-progress-circular indeterminate color="grey"></v-progress-circular> </div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn @click="cancelInvit" style="margin-left: 200px" elevation="0" dark color="red">CANCEL</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn router :to="'/profile/' + player.id" color="blue" tile dark min-width="50%">PROFILE</v-btn>
              <v-btn color="blue" tile dark min-width="50%" class="ml-1" @click="directMessage(player.id)">DM</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title class="d-flex justify-center text-button">
              <!-- BLOCK GLOBAL -->
              <v-btn color="red" tile dark min-width="100%" @click="blockPlayer(player.id)">{{isPlayerBlocked(player.id)}}</v-btn>
            </v-list-item-title>
          </v-list-item>
          <div v-if="!chatDirect && currentChannel.adminId.includes(user.id)">
            <v-list-item dense>
              <v-list-item-title class="d-flex justify-center text-button">
                <v-btn @click="mutePlayer(player.id)" color="red" tile dark min-width="50%" >{{isPlayerMuted(player.id)}}</v-btn>
                <v-btn @click="kickPlayer(player.id)" color="red" class="ml-1" tile dark min-width="50%" >KICK</v-btn>
              </v-list-item-title>
            </v-list-item>                <!-- MUTE BAN FOR AMOUNT OF TIME!! -->
            <v-list-item dense>
              <v-list-item-title class="d-flex justify-center text-button">
                <v-btn @click="banPlayer(player.id)" color="red" tile dark min-width="100%" >{{isPlayerBanned(player.id)}}</v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item dense v-if="currentChannel.owner.id === user.id">
              <v-list-item-title class="d-flex justify-center text-button">
                <v-btn @click="setAdmin(player.id)" color="green lighten-1" tile dark min-width="100%" >
                  <div id="admin">{{isPlayerAdmin(player.id)}}</div>
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>
        <v-divider></v-divider>
      </div>
    </v-list>
    <v-sheet v-else color="rgb(79,85,89)" height="100%" dark width="100%" class="text-center"></v-sheet>
  </v-card>
</template>


<script lang="ts">

import Vue from 'vue';
import io from 'socket.io-client';

export default Vue.extend({
    name: 'PlayerChannel',

    props: {
      socket: {},
    },

    data() {
      return {
        invitDialog: false,
      }
    },

    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      idCurrentChannel: {
        get() {
          return this.$store.getters.getIdCurrentChannel;
        },
        set(value: number) {
          this.$store.commit('setIdCurrentChannel', value);
        }
      },
      myChannels() {
        return this.$store.getters.getMyChannels;
      },
      currentChannel() {
        return this.$store.getters.getCurrentChannel;
      },
      notifySocket() { return this.$store.getters.getNotifySocket; },
      gameSocket: {
        get() {
          return this.$store.getters.getGameSock;
        },
        set(value: undefined) {
          this.$store.commit('setGameSock', value);
        },
      },
      chatDirect: {
        get() {
          return this.$store.getters.getChatDirect;
        },
        set(value: boolean) {
          this.$store.commit('setChatDirect', value);
        },
      },
      directChannels() {
        return this.$store.getters.getDirectChannels;
      },
    },

    methods: {
      isPlayerMuted(idPlayer) {
        if (this.currentChannel.muted.some(mute => mute.user.id === idPlayer))
          return 'UNMUTE';
        return 'MUTE';
      },
      isPlayerBanned(idPlayer) {
        if (this.currentChannel.banned.some(ban => ban.user.id === idPlayer))
          return 'UNBAN';
        return 'BAN';
      },
      isPlayerAdmin(idPlayer) {
        if (this.currentChannel.adminId.includes(idPlayer))
          return "UNSET ADMIN";
        else
          return "SET ADMIN";
      },
      isPlayerBlocked(idPlayer) {
        if (this.user.blocked.includes(idPlayer))
          return "UNBLOCK";
        return "BLOCK";
      },
      mutePlayer(idPlayer) {
        if (idPlayer !== this.currentChannel.owner.id)
          this.socket.emit('mute', {userId: idPlayer, channelId: this.idCurrentChannel});
        else
          this.$toast.error('You cannot mute the owner of the channel');
      },
      kickPlayer(idPlayer) {
        if (idPlayer !== this.currentChannel.owner.id)
          this.socket.emit('leave', {userId: idPlayer, channelId: this.idCurrentChannel});
        else
          this.$toast.error('You can\'t kick the owner of the channel');
      },
      banPlayer(idPlayer) {
        if (idPlayer !== this.currentChannel.owner.id)
          this.socket.emit('ban', {userId: idPlayer, channelId: this.idCurrentChannel});
        else
          this.$toast.error('You can\'t ban the owner of the channel');
      },
      blockPlayer(idPlayer) {
        this.$http.put(`/user/me/block/${idPlayer}`).then(() => {
          this.$http.get('/user/me').then(({data}) => {
            this.$store.commit('setUser', data);
          });
        });
      },
      setAdmin(idPlayer) {
        this.socket.emit('admin', {userId: idPlayer, channelId: this.idCurrentChannel});
      },
      cancelInvit() {
        this.gameSocket.disconnect();
        this.notifySocket.off('notify');
        this.$store.dispatch('enableNotify');
        this.invitDialog = false;
      },
      directMessage(playerId: number) {
        this.socket.once('channelMeDM', (channelMeDM) => {
          if (!channelMeDM.some(dm => dm.users.some(user => user.id === playerId)))
            this.socket.emit('joinDM', playerId);
          else
            this.idCurrentChannel = channelMeDM.find(dm => dm.users.some(user => user.id === playerId)).id;
          this.chatDirect = true;
        });
        this.idCurrentChannel = 0;
        this.socket.emit('channelMeDM');
      },
      invite(id: number) {
        if (this.status != 'orange') {
          this.gameSocket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/pong`, {
            transportOptions: {
              polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
            },
          });
          this.gameSocket.on('info', () => {
              this.gameSocket.emit('room');
          });
          this.gameSocket.on('room', (code) => {
            this.dialog = false;
            this.$store.commit('setGameRoom', code);
            const payload = {
              id: id,
              sender: this.user.id,
              message: this.user.username + " has invited you to play",
              roomCode: code
            };
            this.notifySocket.emit('notify', payload);
            this.notifySocket.on('notify', (data) => {
              if (data.sender == id && this.gameSocket.connected) {
                this.invitDialog = false;
				this.notifySocket.off('notify');
				this.$store.dispatch('enableNotify');
                this.$router.push('/pregame');
              }
            });
          });
        }
      },

      status(status: number) {
        if (status == 1)
          return 'blue';
        else if (status == 2)
          return 'orange';
        else if (status == 3)
          return '#49be25';
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
