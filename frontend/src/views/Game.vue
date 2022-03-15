<template>
<v-container fill-height fluid>
  <v-row justify="center" align="center" >
    <!-- <v-card height="50vh" color="black"> -->
    <!-- <body> -->
    <canvas id="pong"></canvas>
    <!-- </body> -->
    <!-- </v-card> -->
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
        }
    },
    methods: {
        handleMouseMove(event) {
            if (!this.pong) return;
            const y = event.pageY;

            console.log("y = ", y);
            console.log("canvasOffsetTop*2 = ", this.canvas.offsetTop * 2);
            console.log("canvasClientHeight = ", this.canvas.clientHeight);
            console.log(this.canvas.clientHeight + this.canvas.offsetTop*2);
            if (y < this.canvas.offsetTop * 2) return;
            if (y > this.canvas.clientHeight + this.canvas.clientHeight) return;

            const tray = (event.pageY - (this.canvas.offsetTop*2)) / this.canvas.clientHeight;

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
            this.pong.draw();
            window.alert(`${user.username} has won!`);

            document.removeEventListener('mousemove', this.handleMouseMove);
            delete this.pong;
            this.pong = null;
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

canvas {
  height: 50vh;
  display: flex;
  justify-content: center;
  background-color: #121212;

  border: solid white;
  /* border-top: 0; */
  /* border-bottom: 0; */
}
</style>
