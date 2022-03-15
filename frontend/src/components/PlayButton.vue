<template>
<v-dialog width="500" max-height="500" v-model="dialog" persistent>
    <template v-slot:activator="{ on, attrs }">
    <v-btn elevation="1" v-on:click="searchPlayer" v-bind="attrs" v-on="on" slot="activator"
    class="btn" style="font-size: 60px !important;" color="yellow--text" tile x-large depressed
    width="395" height="170">
    PLAY
    </v-btn>
    </template>
    <v-card>
    <v-card-title>
        <div style="margin-left: 120px">
        <h3 class="headline">Searching for player...</h3>
        <div style="margin-left: 95px; margin-top: 30px; margin-bottom: 20px;"> <v-progress-circular indeterminate color="grey"></v-progress-circular> </div>
        </div>
    </v-card-title>
    <v-card-actions>
        <v-btn @click="cancelQueue" style="margin-left: 200px" elevation="0" dark color="red">CANCEL</v-btn>
    </v-card-actions>
    </v-card>
</v-dialog>

</template>


<script lang='ts'>
import Vue from 'vue'
import io from "socket.io-client";

export default Vue.extend({
    name: 'PlayButton',
    data() {
        let date:number = Date.now();

        return {
            dialog: false,
            date,
        }
    },
    methods: {
      cancelQueue() {
            this.socket.on("disconnect", (reason) => {
              console.log(reason);
            });
            this.socket.disconnect(true);
            this.dialog = false;
      },
      searchPlayer() {
        this.socket = io("http://127.0.0.1:3000/pong", {
            transportOptions: {
            polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
            },
        });
        this.$store.commit('setGameSock', this.socket);
        this.$store.state.gameSock.on('info', (data) => {
            console.log('Connected', data);
            this.socket.emit('queue');
        });
        this.socket.on('room', (code) => {
            this.dialog=false;
            console.log(`room ${code} created`);
            this.$store.commit('setGameRoom', code);
            this.$router.push('/pregame');
        });
        return;
      },
    },
})
</script>

<style scoped>

.btn:hover {
    transform: scale(1.1)
}

</style>
