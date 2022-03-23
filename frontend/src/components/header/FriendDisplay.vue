<template>
  <v-container>
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-if="user.id !== undefined" v-auth-image="'/user/'+ user.id +'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left :color="status">
      {{user.username}}
      </v-badge>
      <v-spacer></v-spacer>

      <v-menu dark offset-y>
        <template v-slot:activator="{on}">
          <v-btn class="mt-3" color="primary" dark v-on="on"> OPTIONS </v-btn>
        </template>
        <v-list class="text-center">
          <v-list-item @click="toProfile">
            <v-list-item-title>Profile Player</v-list-item-title>
          </v-list-item>

          <v-dialog width="500" max-height="500" v-model="invitDialog" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-if="user.status != 2" v-bind="attrs" v-on="on" slot="activator" @click="invite">
                <v-list-item-title>Invite to Game</v-list-item-title>
              </v-list-item>
            </template>
            <v-card>
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
          <v-list-item v-if="user.status == 2">
            <v-list-item-title @click="spectate">Spectate</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="directMessage">Direct Message</v-list-item-title>
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
      me: [],
      parentDialog: Boolean
    },
    data() {
      return {
        user: [],
        status: 'grey',
        invitDialog: false,
      }
    },
    computed: {
      gameSocket: {
        get() {
          return this.$store.getters.getGameSock;
        },
        set(value: undefined) {
          this.$store.commit('setGameSock', value);
        },
      },
      notifySocket() { return this.$store.getters.getNotifySocket; },
      chatDirect: {
        get() {
          return this.$store.getters.getChatDirect;
        },
        set(value: undefined) {
          this.$store.commit('setChatDirect', value);
        }
      },
      idCurrentChannel: {
        get() {
          return this.$store.getters.getIdCurrentChannel;
        },
        set(value: number) {
          this.$store.commit('setIdCurrentChannel', value);
        }
      },
      directChannels: {
        get() {
          return this.$store.getters.getDirectChannels;
        },
        set(value: undefined) {
          this.$store.commit('setDirectChannels', value);
        }
      },
    },
    methods: {
      spectate(): void {
        console.log("spectate");
        // vérifier que le user n'est pas deja in game
        if (this.user.status == 2) {
          this.gameSocket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/pong`, {
              transportOptions: {
              polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
              },
          });
          this.gameSocket.on('info', (data) => {
            console.log('Connected', data); // TODO: remove
            this.$http.get('/pong/' + this.user.id).then(response => {
              console.log(response);
              this.gameSocket.emit('room', response.data); // RAJOUTER LE CODE DE LA ROOM
            });
          });
          this.gameSocket.on('ready', (options, players) => {
            console.log(options, players);
            this.$store.commit('setGameOptions', options);
            this.$store.commit('setUsersInGame', players);
          });
          this.gameSocket.on('room', (code) => {
              this.dialog = false;
              this.$store.commit('setGameRoom', code);
              this.$router.push({ name: 'game' });
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
          return 'blue';
        else if (status == 2)
          return 'orange';
        else if (status == 3)
          return '#49be25';
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

      cancelInvit() {
        this.gameSocket.on("disconnect", (reason) => {
          console.log(reason); // TODO: remove
        });
        this.gameSocket.disconnect();
        // destroy roomCode ?
        this.invitDialog = false;
      },

      invite() {
        console.log("invite");
        // vérifier que le user n'est pas deja in game
        if (this.user.status != 2) {
          this.gameSocket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/pong`, {
              transportOptions: {
              polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
              },
          });
          this.gameSocket.on('info', (data) => {
            console.log('Connected', data); // TODO: remove
              this.gameSocket.emit('room');
          });
          this.gameSocket.on('room', (code) => {
            this.dialog = false;
            console.log('CODE ROOM ', code);
            this.$store.commit('setGameRoom', code);
            const payload = {
              id: this.user.id,
              sender: this.me.id,
              message: this.me.username + " has invited you to play",
              roomCode: code
            };
            this.notifySocket.emit('notify', payload);
            this.notifySocket.once('notify', (data) => {
              if (data.sender == this.user.id) {
                console.log('NOTIFY', data); // TODO: remove
                this.invitDialog = false;
                this.$emit('close');
                this.$router.push('/pregame');
              }
            });
          });
        }
      },
      directMessage() {
        const chatSocket = io(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/chat`, {
            transportOptions: {
            polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
            },
        });
        chatSocket.on('info', (data) => {
          console.log('Connected', data); // TODO: remove
          chatSocket.once('channelMeDM', (channelMeDM) => {
            this.chatDirect = true;
            this.directChannels = channelMeDM;
            if (!channelMeDM.some(dm => dm.users.some(user => user.id === this.user.id)))
              chatSocket.emit('joinDM', this.user.id);
            else
              this.idCurrentChannel = channelMeDM.find(dm => dm.users.some(user => user.id === this.user.id)).id;
            chatSocket.disconnect();
            this.$emit('close');
            if (this.$router.currentRoute.name !== 'community')
              this.$router.push({ name: 'community' });
          });
          this.idCurrentChannel = 0;
          chatSocket.emit('channelMeDM');
        });
      },
  },
  created() {
    this.fetchFriend();
  },
});
</script>

<style scoped>
/* @import '../assets/fonts/LEMONMILK/stylesheet.css'; */


.name {
    font-family: "lemon_milkbold" !important;
    margin-left: 10px;
}

</style>
