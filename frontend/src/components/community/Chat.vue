<template>
    <v-card tile flat class="mx-10 d-flex flex-column" color="white" min-width="50%" max-width="50%" height="645">
    <v-container fluid>
    
        <v-sheet color="green" height="100" dark width="100%" class="text-center">
        <v-divider class="pt-4"></v-divider>
        <span class="span"> CHAT </span>
        </v-sheet>
        
        <v-card elevation="2" class="pt-3 mt-3" color="white" min-width="100%" max-width="100%" height="440">
            <v-list>
                <div v-for="cM in chatMsg" :key="cM.sender">
                <v-card v-if="cM.sender != 'MOI'" flat tile width="400px" color="white" >
                <v-card-text>
                        {{cM.sender}}
                        <div> {{cM.msg}} </div>
                </v-card-text>
                </v-card >                
                <v-card v-if="cM.sender == 'MOI'" flat tile width="100%" color="blue" dark style="justify: right">
                <v-card-text class="text-right">
                    {{cM.sender}}
                    <div> {{cM.msg}} </div>
                </v-card-text>
                </v-card >
                <v-divider class="mt-1"></v-divider>
                </div>
            </v-list>
        </v-card>


    <v-spacer></v-spacer>
    <v-row style="margin-top: 0px">
        <v-col cols="12">
      <v-card-actions>
        <v-sheet color="green" height="50" dark width="100%" class="text-center">
            <v-app-bar bottom color="rgba(0,0,0,0)" flat>
                <v-text-field class="mt-5" append-outer-icon="mdi-send"
                filled clear-icon="mdi-close-circle" label="Message" type="text"
                ></v-text-field>
            </v-app-bar>
        </v-sheet>
      </v-card-actions>
        </v-col>
    </v-row>
    </v-container>
    </v-card>
</template>


<script lang="ts">
import Vue from 'vue';
import io from "socket.io-client";


const chatMsg = [
    { sender: 'Billy', msg: 'yo les copains sa va ?' },
    { sender: 'Zidane', msg: 'youyou sa va é toi ??' },
    { sender: 'Macron', msg: 'C4EST NOTRE PROJEEET' },
    { sender: 'sangoku', msg: 'KAMEEEEEEEEHAAAAAAAMEEEEEEEEEHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
    { sender: 'MOI', msg: 'oh pas de spam stp' },
    { sender: 'CHEVRE', msg: 'oh pas de spam stp' },
]


export default Vue.extend({
    name: 'Chat',
    data() {
        return {
            socket: {},
            chatMsg,
        }
    },
    created() {
        this.socket = io("http://127.0.0.1:3000/chat", {
            transportOptions: {
            polling: { extraHeaders: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDUzMiIsImlhdCI6MTY0NjA1ODI3MCwiZXhwIjoxNjQ2NjYzMDcwfQ.ocrm7sytMMTAOSUGBt_ku6vpI9AoXbF2nmCn27Uq6Kc` } },
            },
        });
    },
    mounted() {
        this.socket.on("info", data => {
            console.log(data);
        });
        /*this.socket.emit('text', {
            id: 1,
            value: "hey",
        });*/
        this.socket.on("text", data => {
            console.log(data);
        });
    }
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

.v-list{
  height:440px;
  overflow-y:auto
}

</style>
