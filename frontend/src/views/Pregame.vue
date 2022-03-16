<template>
  <v-container fluid class="mt-10">
    <v-row align="center" justify="center">
    <v-col cols="7">
      <v-card flat color="green" height="220">
        <v-card-text class="white--text">
        <v-row class="mt-9" align="center" justify="center">
          <v-col cols="12">
          <p class="text-center">
            VOTE FOR MAP
          </p>
          </v-col>
          <v-btn-toggle mandatory tile group>
          <v-btn > Requiem </v-btn> <v-btn> Classic </v-btn> <v-btn> Electro </v-btn>
          </v-btn-toggle>
        </v-row>
        </v-card-text>
      </v-card>

      <v-card flat color="green" class="mt-3" height="150">
        <v-card-text class="white--text">
        <v-row align="center" justify="center" class="mt-1">
          <v-col cols="12">
          <p class="text-center">
            VOTE FOR POWER-UP
          </p>
          </v-col>
          <v-btn-toggle v-model="toggle_exclusive" multiple borderless rounded background-color="green">
          <v-btn>
            <v-icon>mdi-account-child-circle</v-icon>
          </v-btn>
          <v-btn class="mx-1">
            <v-icon>mdi-album</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-cricket</v-icon>
          </v-btn>
          </v-btn-toggle>
        </v-row>
        </v-card-text>
      </v-card>

    <v-btn v-on:click="readyStat" id="ready" :loading="loader" :color="color" class="mt-5" block height="60" > READY ? </v-btn>
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
      toggle_exclusive: undefined,
      player: [
        {name: "DUDE"},
        {name: "CHEVRE"},
      ],
      loader: false,
      color: 'white',
    }
  },
  methods:{
    readyStat() {
      console.log("PLAYER READY");
      this.loader = !this.loader;
      this.color = 'green';
      this.$store.state.gameSock.emit('ready', { plan: 0, mode: 0 });
      this.$store.state.gameSock.on('start', (options, users) => {
        console.log('Game started!', options);
        this.$store.commit('setGameOptions', options);
        this.$store.commit('setUsersInGame', users);
        this.$router.push('/game');
        // setTimeout(this.launchGame, 3000);
      });
    },
    launchGame() {
      this.$router.push('/game');
    }
  }
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
