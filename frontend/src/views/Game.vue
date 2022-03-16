<template>
<v-container fill-height fluid>
  <v-dialog v-model="endDialog" persistent transition="dialog-top-transition" max-width="600">
    <template>
      <v-card>
        <v-toolbar color="primary" dark>Game INFO</v-toolbar>
        <v-card-text>
          <div class="text-h2 pa-12"> {{winner}} has won! </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="leaveRoom">Leave Room</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-row justify="center" align="center" >
    <v-card color="green" tile>
      <div class="text-center font-weight-bold text-h3 mt-6">
        {{this.$store.state.usersInGame[0].username}}
        <span class="white--text"> VS </span>
        {{this.$store.state.usersInGame[1].username}}
      </div>
      <canvas class="mx-5 my-5" id="pong"></canvas>
    </v-card>
  </v-row>
</v-container>
</template>


<script lang='ts'>
import Vue from 'vue';
import {Pong} from '@/pong/pong.js'

export default Vue.extend({
    name: 'Game',
    data() {
        return {
            gameSock: this.$store.state.gameSock,
            canvas: document.getElementById('pong'),
            me: this.$store.state.user,
            pong: null,
            endDialog: false,
            winner: '',
        }
    },
    methods: {
      leaveRoom() {
        this.endDialog = false;
        this.$router.push({ name: 'Main'});
      },
      handleMouseMove(event) {
        if (!this.pong) return;
        const y = event.pageY;
        if (y < window.pageYOffset + this.canvas.getBoundingClientRect().top) return;
        if (y > this.canvas.clientHeight + window.pageYOffset + this.canvas.getBoundingClientRect().top) return;
        const tray = (event.pageY - window.pageYOffset - this.canvas.getBoundingClientRect().top) / this.canvas.clientHeight;
        this.pong.updateTray(this.me, tray);
        this.gameSock.emit('tray', tray);
      },
    },
    mounted() {
      this.canvas = document.getElementById('pong');
      console.log("GAME SOCK", this.gameSock);
      this.pong = new Pong(this.canvas, this.$store.state.gameOptions, this.me.id, this.$store.state.usersInGame);
      document.addEventListener('mousemove', this.handleMouseMove);
      this.gameSock.on('ball', (ball) => this.pong.updateBall(ball.x, ball.y));
      this.gameSock.on('score', (scores) => this.pong.updateScore(scores));
      this.gameSock.on('tray', (player, tray) => this.pong.updateTray(player, tray));

      this.gameSock.on('stop', (user) => {
        this.winner = user.username;
        this.pong.draw();
        document.removeEventListener('mousemove', this.handleMouseMove);
        delete this.pong;
        this.pong = null;
        this.endDialog = true;
        
        this.gameSock.on('disconnect', ()=>{
            console.log("disconnected");
            this.$store.commit('setGameRoom', '');
            this.$store.state.gameSock.disconnect();
            this.$store.state.gameSock.close();
          });
          this.$store.state.gameSock.disconnect(true);
        });
    }
})
</script>

<style scoped>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  background-color: #121212;
}

/* @media and (aspect-ratio: 11/5) { ... } */
canvas {
  /* height: 60vh; */
  width: 80vw;
  display: flex;
  justify-content: center;
  background-color: #121212;

  border: solid white;
  /* border-top: 0; */
  /* border-bottom: 0; */
}
</style>
