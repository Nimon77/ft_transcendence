<template>
    <v-card tile flat class="mx-10" color="white" min-width="50%" max-width="100%" height="80%">
    
        <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
        </v-sheet>
        
            <v-list max-height="70vh" class="mt-3 d-flex flex-column">
                <div v-for="(cM, index) in chatMsg" :key="index">
                    <v-card v-if="cM.sender != user.username" flat tile class="mb-1 ml-2 d-flex justify-center" width="25%" color="grey" >
                            <div class="font-weight-bold mt-2 ml-3"> {{cM.sender}} </div>
                            <div class=" mb-2 ml-3"> {{cM.msg}} </div>
                    </v-card >                
                    <div class="d-flex justify-end">
                    <v-card v-if="cM.sender == user.username" class="mb-1 mr-2 text-right d-flex justify-center" tile flat width="25%" color="blue" dark>
                            <div class="font-weight-bold mr-4 mt-1"> {{cM.sender}} </div>
                            <div class="mr-4 mb-1"> {{cM.msg}} </div>
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
        }
    },
    methods: {
        sendMsg() {
            if (this.input == '' || this.idCR == 0)
                return;

            this.socket.emit('text', {
                id: this.idCR,
                value: this.input,
            });
            this.input = '';
        },
    },
    created() {
        this.$watch(() => this.idCR, () => {this.chatMsg = []; },{ immediate: true })
        this.socket.on( "text", data => {
            console.log("TEXT EVENT", data);
            this.chatMsg.push( { sender: data.user.username, msg: data.value } );
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
