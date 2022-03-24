<template>
  <v-container fluid class="mt-10">
    <v-row align="center" justify="center">
    <v-col cols="7">
      <v-card dark flat color="green" height="220">
        <v-card-text class="white--text">
        <v-row class="mt-9" align="center" justify="center">
          <v-col cols="12">
          <p class="text-center">
            VOTE FOR MAP
          </p>
          </v-col>
          <v-btn-toggle v-model="gameMap" mandatory tile group>
          <v-btn > Banana </v-btn> <v-btn> Orange </v-btn> <v-btn> Blueberry </v-btn>
          </v-btn-toggle>
        </v-row>
        </v-card-text>
      </v-card>

      <v-card dark flat color="green" class="mt-3" height="150">
        <v-card-text class="white--text">
        <v-row align="center" justify="center" class="mt-1">
          <v-col cols="12">
          <p class="text-center">
            VOTE FOR POWER-UP
          </p>
          </v-col>
          <v-btn-toggle v-model="gameMode" borderless mandatory rounded background-color="green">
          <v-btn>
            <v-icon>mdi-close-octagon</v-icon>
          </v-btn>
          <v-btn class="mx-1">
            <v-icon>mdi-skip-forward</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-magnify-minus</v-icon>
          </v-btn>
          </v-btn-toggle>
        </v-row>
        </v-card-text>
      </v-card>

    <v-btn dark v-on:click="readyStat" id="ready" :loading="loader" :color="color" class="mt-5" block height="60" > READY ? </v-btn>
    </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Pregame',
  data() {
    return {
      gameMode: [],
      gameMap: [],
      player: [
        {name: "DUDE"},
        {name: "CHEVRE"},
      ],
      loader: false,
      color: 'dark',
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
  },
  methods:{
    readyStat() {
      this.gameSock.on('stop', () => {
        this.endDialog = true;
        this.gameSock.disconnect();
      });
      this.loader = !this.loader;
      this.color = 'green';
      this.gameSock.on('ready', (options, users) => {
        this.$store.commit('setGameOptions', options);
        this.$store.commit('setUsersInGame', users);
        this.gameSock.off('stop');
        this.$router.push({ name: 'game'});
      });
      this.gameSock.emit('ready', { plan: this.gameMap, mode: this.gameMode });
    }
  },
  created() {
    this.gameSock.on('stop', () => {
      this.endDialog = true;
      this.gameSock.disconnect();
      this.$toast.warning("Other player leave", {
        position: 'top-center',
        pauseOnHover: false,
      })
      this.$router.push({ name: 'Main' });
    });
  },

  beforeRouteLeave(to, from, next) {
    if (this.gameSock.connected && to.name !== 'game')
      this.gameSock.disconnect();
    next();
  },
});
</script>

<style scoped>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

p {
  font-family: "lemon_milkmedium";
  font-size: 30px;
  letter-spacing: 0.1em;
  /* margin-left: 60px; */
}
</style>
