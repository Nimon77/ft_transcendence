<template>
    <v-card tile flat class="mx-10" dark width="50%" height="80%">
      <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
      </v-sheet>
      <v-list v-if="idCurrentChannel != 0" id="Chat" max-height="70vh" class="mt-3 d-flex flex-column">
        <div v-for="(message, index) in messages" :key="index">
          <v-card v-if="message.sender.id != user.id && !isBlocked(message.sender.id)"
            flat
            tile
            class="mb-1 ml-2 d-flex justify-center"
            :width="senderWidth(message.msg)"
            color="grey"
          >
            <div class="font-weight-bold mt-2 ml-3"> {{message.sender.username}} </div>
            <div class="mr-2 mb-2 ml-3"> {{message.msg}} </div>
          </v-card >
          <div class="d-flex justify-end">
          <v-card v-if="message.sender.id == user.id"
            class="mb-1 mr-2 text-right d-flex justify-center"
            tile
            flat
            :width="senderWidth(message.msg)"
            color="blue"
            dar
          >
            <div class="font-weight-bold mr-4 mt-1"> {{user.username}} </div>
            <div class="mr-4 mb-1 ml-2"> {{message.msg}} </div>
          </v-card>
          </div>
        </div>
      </v-list>

      <v-sheet v-else color="rgb(79,85,89)" height="100%" dark width="100%" class="text-center">
          <v-divider class="pt-4"></v-divider>
          <span class="span vertical-center"> PLEASE SELECT A CHANNEL </span>
      </v-sheet>

      <v-spacer></v-spacer>
        <v-card-actions v-if="idCurrentChannel != 0">
          <v-sheet color="grey" height="50" dark width="100%" class="text-center">
              <v-app-bar bottom color="rgba(0,0,0,0)" flat>
                  <v-text-field class="mt-5" v-model="input" append-outer-icon="mdi-send"
                  label="Message" type="text" v-on:click:append-outer="sendMsg" v-on:keyup.enter="sendMsg"
                  ></v-text-field>
              </v-app-bar>
          </v-sheet>
        </v-card-actions>
    </v-card>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Chat',

    props: {
      socket: {},
    },

    data() {
      return {
        input: '',
        messages: [],
        logs: [],
        sendNotif: true,
      }
    },

    computed: {
        user() {
            return this.$store.getters.getUser;
        },
        idCurrentChannel() {
          return this.$store.getters.getIdCurrentChannel;
        },
        chatDirect() {
          return this.$store.getters.getChatDirect;
        },
    },

    methods: {
      senderWidth(msg) {
        if (msg.length > 70)
          return "65%";
        if (msg.length > 39)
          return "50%";
        if (msg.length > 20)
          return "25%";
        if (msg.length > 30)
          return "30%";
        return "25%"
      },
      isBlocked(idPlayer) {
        if (this.user.blocked.indexOf(idPlayer) == -1 || this.chatDirect)
          return false;
        return true;
      },
      sendMsg() {
        if (this.input == '' || this.idCurrentChannel == 0)
          return;
        if (this.chatDirect)
          this.socket.emit('textDM', {
            text: this.input,
            channelId: this.idCurrentChannel,
          });
        else
          this.socket.emit('text', {
            id: this.idCurrentChannel,
            user: this.user,
            value: this.input,
          });
        this.input = '';
      },
      cleanLogs() {
        if (this.idCurrentChannel == 0)
            this.messages = [];
        if (this.idCurrentChannel > 0) {
          if (this.chatDirect) {
            this.socket.emit('channelDM', this.idCurrentChannel);
          }
          else
            this.socket.emit('channel', {
              id: this.idCurrentChannel
            });
        }
      },
      pushLogs() {
        this.messages = [];
        for (let i in this.logs)
          this.messages.push( { sender: this.logs[i].user, msg:  this.logs[i].message} )
        if (this.idCurrentChannel != 0)
          setTimeout(() => {
            document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
          }, 100);
      }
    },

    created() {
        this.$watch(() => this.idCurrentChannel, () => { this.cleanLogs(); },{ immediate: true })
        this.socket.on("text", data => {
          // console.log("TEXT EVENT", data); // TODO: remove
          if (data.id == this.idCurrentChannel && !this.chatDirect)
          {
            this.messages.push( { sender: data.user, msg: data.value } );
            setTimeout(() => {
              document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
            }, 100);
          }
        });
        this.socket.on("textDM", data => {
          // console.log("TEXT DM EVENT", data); // TODO: remove
          if (data.channelId == this.idCurrentChannel && this.chatDirect)
          {
            this.messages.push( { sender: data.user, msg: data.text } );
            setTimeout(() => {
              document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
            }, 100);
          }
          else if (data.user.id != this.user.id) {
            if (this.sendNotif) {
              this.sendNotif = false;
              this.$toast.info('You have a new message from ' + data.user.username, {
                position: 'top-center',
                duration: 5000
              });
              setTimeout(() => {
                this.sendNotif = true;
              }, 10000);
            }
          }
        });
        this.socket.on("channel", data => {
          // console.log("CHANNEL EVENT", data); // TODO: remove
          if (data.id == this.idCurrentChannel && !this.chatDirect)
          {
            this.logs = data.logs;
            this.pushLogs();
          }
        });
        this.socket.on("channelDM", data => {
          // console.log("CHANNELDM EVENT", data); // TODO: remove
          if (data.id == this.idCurrentChannel && this.chatDirect)
          {
            this.logs = data.logs;
            this.pushLogs();
          }
        });
    },
})
</script>

<style scoped>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.span {
  font-family: "lemon_milkmedium";
  font-size: 40px;
  letter-spacing: 0.2em;
  /* margin-left: 60px; */
}

.vertical-center {
  margin: 0;
  position: relative;
  top: calc(50% - 55px);
}

.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-list{
  display: flex !important;
  flex-direction: column;
  /* height: 100%; */
  overflow-y:auto
}

</style>
