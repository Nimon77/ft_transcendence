<template>
<div>
    <v-container>
    <v-row class="mt-12" style="justify-content: center;">
    <v-card class="mt-6" max-width="700">
        <v-list-item three-line>
        <v-list-item-content>
            <div class="text-overline mb-n4">
            <p class="font-weight-bold text-h5" > Player Profile </p>
            </div>
            <v-list-item-title class="text-h5 my-2">
            {{user.username | upCase}} <span class="text-h6 font-weight-bold" > {{user.rank}}  <v-icon class="mb-3" color="orange"> mdi-food </v-icon> </span>
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-bold green--text">
                WINS : {{playerItems[0].nbWin}} <span class="font-weight-bold black--text"> | </span>
                <span class="red--text"> LOSSES : {{playerItems[0].nbLoss}} </span>
            </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile size="80">
            <img v-auth-image="'/user/'+this.$route.params.id+'/avatar'"/>
        </v-list-item-avatar>
        </v-list-item>
    </v-card>
    </v-row>
    <v-row style="justify-content: center;">
    <v-card class="mt-6" max-width="700">
    <v-list-item>
      <v-list-item-content>
        <div class="text-overline text-center mb-4">
          Match History
        </div>
        <div v-for="ph in playerHistory" v-bind:key="ph.name" class="text-h text-center mb-3">
            {{user.log}}
            <span v-if="ph.win==1" class="green--text"> has won against </span>
            <span v-if="ph.win==0" class="red--text"> has lose against </span>
            {{ph.name}}
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</v-row>
</v-container>
</div>
</template>


<script lang="ts">
import Vue from 'vue'

import Player from '@/components/header/Player.vue'

Vue.component('Player', Player)

export default Vue.extend({
    name: 'Profile',
    data() {
        const playerHistory = [
            { name: 'bill', win: 1 },
            { name: 'chevre', win: 0 },
            { name: 'MACRON', win: 0 },
            { name: 'plume', win: 1 }
        ]
        const playerItems = [{
            name: 'DUDE',
            avt: 'avatarExample.png',
            nbWin: 50,
            nbLoss: 26,
        }]
        return {
            playerItems,
            playerHistory,
            user: [],
        }
    },

    methods: {
        async fetchUser() {
            await this.$http.get('/user/'+ this.$route.params.id).then(response => {
                this.user = response.data; });
        }
    },
    async created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.fetchUser();
            },
            { immediate: true }
        )
    },
});
</script>
