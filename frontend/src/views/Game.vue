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
          <v-btn color="blue" dark @click="leaveRoom">Leave Room</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-row justify="center" align="center" >
    <v-card color="green" tile>
      <div class="text-center font-weight-bold text-h3 mt-6">
        {{this.$store.getters.getUsersInGame[0].username}}
        <span class="white--text"> VS </span>
        {{this.$store.getters.getUsersInGame[1].username}}
      </div>
      <canvas :style="{'background-color': mapColor}" class="mx-5 my-5" id="pong"></canvas>
    </v-card>
  </v-row>
</v-container>
</template>


<script lang='ts'>
import Vue from 'vue';
import {Pong} from '@/plugins/pong.ts'

export default Vue.extend({
    name: 'Game',
    data() {
        return {
            canvas: document.getElementById('pong'),
            me: this.$store.getters.getUser,
            pong: null,
            endDialog: false,
            winner: '',
            input: [],
            mapColor: '#121212',
        }
    },
    computed: {
      gameSock: {
        get() {
          return this.$store.getters.getGameSock;
        },
        set(value) {
          this.$store.commit('setGameSock', value);
        }
      },
      options: {
        get() {
          return this.$store.getters.getGameOptions;
        },
        set(value) {
          this.$store.commit('setGameOptions', value);
        }
      },
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
      this.input = this.options.input;
      if (this.input.plan == 0)
        this.mapColor = '#121212';
      if (this.input.plan == 1)
        this.mapColor = '#040a80';
      if (this.input.plan == 2)
        this.mapColor = '#db9c14';

      if (this.input.mode == 1)
      {
        this.options.ball.speed = 100;
        this.options.ball.radius = 35;
      }
      if (this.input.mode == 2)
      {
        this.options.tray.height = 100;
        this.options.tray.width = 30;
      }
      console.log("GAME OPTIONS", this.options);
      this.pong = new Pong(this.canvas, this.options, this.me.id, this.$store.getters.getUsersInGame);
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
            this.gameSock.disconnect();
            this.gameSock.close();
          });
          this.gameSock.disconnect(true);
        });

		let count = 3;
		const intervalID = setInterval(() => {
			if (count) {
				this.pong.context.clearRect(
					0,
					0,
					this.options.display.width,
					this.options.display.height,
				);
				this.pong.context.beginPath();
				this.pong.context.fillStyle = 'white';
				this.pong.context.font = '48px Impact';
				this.pong.context.fillText(count, this.options.display.width / 2, this.options.display.height / 2);
				this.pong.context.closePath();
				return count--;
			}
			clearInterval(intervalID);
			this.gameSock.emit('start');
		}, 1000);
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

  border: solid white;
  /* border-top: 0; */
  /* border-bottom: 0; */
}
</style>
