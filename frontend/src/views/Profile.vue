<template>
  <v-container fill-height fluid>
    <v-row align="center">
      <v-col class="d-flex justify-center" cols="12" >
        <v-card class="mx-auto" max-width="700" dark color="#121212" outlined tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                Player overview
              </div>
              <v-list-item-title class="text-h5 font-weight-bold mb-1">
                {{user.username | upCase}} <span class="text-h6 ml-1" > rank : {{user.rank}}  <v-icon class="mb-3" color="orange"> mdi-food </v-icon> </span>
              </v-list-item-title>
              <v-list-item-subtitle class="font-weight-bold mt-n1" style="color: rgb(168, 213, 146)">
                WINS : {{playerItems.nbWin}} <span class="font-weight-bold black--text"> | </span>
                <span class="red--text"> LOSSES : {{playerItems.nbLoss}} </span>
              </v-list-item-subtitle>
              <v-list-item-subtitle>"For the holy Banana"</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="110">
              <img v-auth-image="'/user/'+this.$route.params.id+'/avatar'"/>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col class="d-flex justify-center" cols="12" >
        <v-card max-width="500" dark color="#121212">
          <v-list-item>
            <v-list-item-content class="text-center">
              <div class="mt-3 mb-7 text-h5 font-weight-bold"> MATCH HISTORY </div>
              <div v-for="ph in playerHistory" v-bind:key="ph.date" class="text-h mb-3">
                <div v-if="ph.winner.id == user.id">
                  <span class="text-center font-weight-bold" style="color: rgb(168, 213, 146)"> ({{ph.score[1]}} | {{ph.score[0]}}) - </span>
                  <span class="text-center font-weight-bold" style="color: rgb(168, 213, 146)"> WON AGAINST</span>
                  <span> {{ph.loser.username | upCase}} </span>
                </div>
                <div v-else>
                  <span class="text-center font-weight-bold red--text"> ({{ph.score[0]}} | {{ph.score[1]}}) - </span>
                  <span class="text-center font-weight-bold red--text"> LOST AGAINST</span>
                  <span> {{ph.winner.username | upCase}} </span>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import Vue from 'vue';

import Player from '@/components/header/Player.vue';

Vue.component('Player', Player);

export default Vue.extend({
  name: 'Profile',
  data(): unknown {
    return {
      playerItems: {
        nbWin: 0,
        nbLoss: 0,
      },
      playerHistory: [],
      user: {},
    };
  },

  methods: {
    countWinLose() {
      const nbWin = this.playerHistory.filter(ph => ph.winner.id === this.user.id).length;
      const nbLoss = this.playerHistory.filter(ph => ph.loser.id === this.user.id).length;
      this.playerItems.nbWin = nbWin;
      this.playerItems.nbLoss = nbLoss;
    },
    fetchUser() {
      this.$http.get('/user/'+ this.$route.params.id).then(response => {
        this.user = response.data;
        this.$http.get('/user/matches/'+ this.$route.params.id).then(response => {
          this.playerHistory = response.data;
          this.countWinLose();
          this.playerHistory.sort((a, b) => { // sort by date
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        });
      });
    }
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => this.fetchUser(),
      { immediate: true }
    );
  },
});
</script>

<style scoped>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';
.spacing{
}
</style>
