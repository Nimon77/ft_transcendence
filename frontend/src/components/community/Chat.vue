<template>
    <v-card tile flat class="mx-10" color="white" width="50%" height="80%">
      <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
      </v-sheet>
      <v-list v-if="idCR != 0" id="Chat" max-height="70vh" class="mt-3 d-flex flex-column">
        <div v-for="(cM, index) in chatMsg" :key="index">
          <v-card v-if="cM.sender.id != user.id && !isBlocked(cM.sender.id)" flat tile class="mb-1 ml-2 d-flex justify-center" width="25%" color="grey" >
            <!-- v-if="cM.sender n'est pas bloqué par le user" -->
            <div class="font-weight-bold mt-2 ml-3"> {{cM.sender.username}} </div>
            <div class="mr-2 mb-2 ml-3"> {{cM.msg}} </div>
          </v-card >
          <div class="d-flex justify-end">
          <v-card v-if="cM.sender.id == user.id" class="mb-1 mr-2 text-right d-flex justify-center" tile flat width="25%" color="blue" dark>
            <div class="font-weight-bold mr-4 mt-1"> {{user.username}} </div>
            <div class="mr-4 mb-1 ml-2"> {{cM.msg}} </div>
          </v-card>
          </div>
        </div>
      </v-list>

      <v-sheet v-else color="grey" height="100%" dark width="100%" class="text-center">
          <v-divider class="pt-4"></v-divider>
          <span class="span vertical-center"> PLEASE SELECT A CHANNEL </span>
      </v-sheet>

      <v-spacer></v-spacer>
        <v-card-actions v-if="idCR != 0">
          <v-sheet color="grey" height="50" dark width="100%" class="text-center">
              <v-app-bar bottom color="rgba(0,0,0,0)" flat>
                  <v-text-field class="mt-5" v-model="input" append-outer-icon="mdi-send"
                  filled label="Message" type="text" v-on:click:append-outer="sendMsg" v-on:keyup.enter="sendMsg"
                  ></v-text-field>
              </v-app-bar>
          </v-sheet>
        </v-card-actions>
    </v-card>
</template>


<script lang="ts">
import Vue from 'vue';

const chatMsg = [];


export default Vue.extend({
    name: 'Chat',
    props: {
        socket: {},
        idCR: Number,
    },
    data() {
        return {
            input: '',
            chatMsg,
            logs: [],
        }
    },
    methods: {
        isBlocked(idPlayer) {
          if (this.user.blocked.indexOf(idPlayer) == -1)
            return false;
          return true;
        },
        async sendMsg() {
            if (this.input == '' || this.idCR == 0)
                return;

            try {
                await this.$http.put('/channel/'+ this.idCR +'/log', {message: this.input}).then((resp)=>{console.log('PUT LOG', resp);
                });
            } catch (error) {
                if (error.message.match("403"))
                    alert("You've been MUTED in this channel");
                else
                    alert("You cannot do anything in here");
                return;
            }
            this.socket.emit('text', {
                id: this.idCR,
                user: this.user,
                value: this.input,
            });
            this.input = '';
        },
        async cleanLogs() {
            if (this.idCR == 0)
                this.chatMsg = [];
            if (this.idCR > 0)
                await this.$http.get('/channel/'+ this.idCR +'/log').then((resp) => {
                this.logs = resp.data;})
            console.log('LOGS', this.logs);
            this.chatMsg = [];
            for (let i in this.logs)
                this.chatMsg.push( { sender: this.logs[i].user, msg:  this.logs[i].message} )
            if (this.idCR != 0)
              setTimeout(() => {
                document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
              }, 100);
        },
    },
    created() {
        this.$watch(() => this.idCR, () => { this.cleanLogs(); },{ immediate: true })
        this.socket.on( "text", data => {
            console.log("TEXT EVENT", data);
            if (data.id == this.idCR)
            {
                this.chatMsg.push( { sender: data.user, msg: data.value } );
                setTimeout(() => {
                    document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
                }, 100);
            }
        });
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
})
</script>

<style scoped>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

html {
  overflow: hidden !important;
}

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
