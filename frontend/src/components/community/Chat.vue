<template>
    <v-card tile flat class="mx-10" color="white" width="50%" height="80%">

        <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
        </v-sheet>

            <v-list id="Chat" max-height="70vh" class="mt-3 d-flex flex-column">
                <div v-for="(cM, index) in chatMsg" :key="index">
                    <v-card v-if="cM.sender != user.username" flat tile class="mb-1 ml-2 text-left d-flex justify-center" max-width="50%" color="grey" >
                            <!-- v-if="cM.sender n'est pas bloqué par le user" -->
                            <div class="font-weight-bold mr-2 mt-2 ml-3"> {{cM.sender}} </div>
                            <div class="mr-2 mb-2 ml-3"> {{cM.msg}} </div>
                    </v-card >
                    <div class="d-flex justify-end">
                    <v-card v-if="cM.sender == user.username" class="mb-1 mr-2 text-right d-flex justify-center" tile flat max-width="50%" color="blue" dark>
                            <div class="font-weight-bold ml-2 mr-4 mt-1"> {{cM.sender}} </div>
                            <div class="mr-4 mb-1 ml-2"> {{cM.msg}} </div>
                    </v-card>
                    </div>
                </div>
            </v-list>


    <v-spacer></v-spacer>
      <v-card-actions>
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
        user: [],
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
        async sendMsg() {
            if (this.input == '' || this.idCR == 0)
                return;

            try {
                await this.$http.put('/channel/'+ this.idCR +'/log', {msg: this.input}).then((resp)=>{console.log('PUT LOG', resp);
                });
            } catch (error) {
                // console.log(error.message.match("404"));
                if (error.message.match("403"))
                    alert("You've been MUTED in this channel");
                else
                    alert("You cannot do anything in here");
                return;
            }
            this.socket.emit('text', {
                id: this.idCR,
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
            // console.log('LOGS', this.logs);
            this.chatMsg = [];
            for (let i in this.logs)
                this.chatMsg.push( { sender: this.logs[i].userId, msg:  this.logs[i].message} )
            // document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
        },
    },
    created() {
        this.$watch(() => this.idCR, () => { this.cleanLogs(); },{ immediate: true })
        this.socket.on( "text", data => {
            console.log("TEXT EVENT", data);
            if (data.id == this.idCR)
            {
                this.chatMsg.push( { sender: data.user.username, msg: data.value } );
                document.getElementById('Chat').scrollTop = document.getElementById('Chat').scrollHeight;
            }
        });
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
