<template>
    <v-card tile flat class="mx-10" color="white" min-width="50%" max-width="100%" height=100%>
    
        <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
        </v-sheet>
        
        <!-- <v-card elevation="2" class="pt-3 mt-3" color="white" width="100%" height="100%"> -->
            <v-list max-height="70vh" class="mt-3 d-flex flex-column">
                <div v-for="(cM, index) in chatMsg" :key="index">
                    <v-card v-if="cM.sender != 'MOI'" flat tile width="100%" color="white" >
                        <!-- <v-card-text class="align-center"> -->
                            <div class="font-weight-bold mt-2 ml-4"> {{cM.sender}} </div>
                            <div class=" mb-2 ml-4"> {{cM.msg}} </div>
                        <!-- </v-card-text> -->
                    </v-card >                
                    <v-card v-if="cM.sender == 'MOI'" class="text-right" flat tile width="100%" color="blue" dark style="justify: right">
                            <div class="font-weight-bold mr-4 mt-1"> {{cM.sender}} </div>
                            <div class="mr-4 mb-1"> {{cM.msg}} </div>
                    </v-card >
                <v-divider ></v-divider>
                </div>
            </v-list>
        <!-- </v-card> -->


    <v-spacer></v-spacer>
    <!-- <v-row> -->
        <!-- <v-col cols="12"> -->
      <v-card-actions>
        <v-sheet color="grey" height="50" dark width="100%" class="text-center">
            <v-app-bar bottom color="rgba(0,0,0,0)" flat>
                <v-text-field class="mt-5" v-model="input" append-outer-icon="mdi-send"
                filled label="Message" type="text" v-on:click:append-outer="sendMsg" v-on:keyup.enter="sendMsg"
                ></v-text-field>
            </v-app-bar>
        </v-sheet>
      </v-card-actions>
        <!-- </v-col> -->
    <!-- </v-row> -->
    </v-card>
</template>


<script lang="ts">
import Vue from 'vue';
// import io from "socket.io-client";


const chatMsg = [
    // { sender: 'Billy', msg: 'yo les copains sa va ?' },
    // { sender: 'Zidane', msg: 'youyou sa va é toi ??' },
    // { sender: 'Macron', msg: 'C4EST NOTRE PROJEEET' },
    // { sender: 'sangoku', msg: 'KAMEEEEEEEEHAAAAAAAMEEEEEEEEEHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
    // { sender: 'MOI', msg: 'oh pas de spam stp' },
    // { sender: 'CHEVRE', msg: 'oh pas de spam stp' },
]


export default Vue.extend({
    name: 'Chat',
    props: {
        socket: {},
        user: [],
    },
    data() {
        return {
            input: '',
            chatMsg,
        }
    },
    methods: {
        sendMsg() {
            if (this.input != '')
                console.log(this.input);
            else
                return;

            this.socket.emit('text', {
                id: this.user.id,
                value: this.input,
            });
            this.input = '';
        },
    },
    created() {
        this.socket.on( "text", data => {
            console.log("TEXT EVENT", data);
            this.chatMsg.push( { sender: data.id, msg: data.value } );
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
