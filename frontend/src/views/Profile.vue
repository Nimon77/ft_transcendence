<template>
<div>
    <v-container>
    <v-row class="mt-12" style="justify-content: center;">
    <v-cols>
    <v-card >
        <v-list-item three-line>
        <v-list-item-content>
            <div class="text-overline mb-n4">
            <p class="font-weight-bold text-h5" > Player Profile </p>
            </div>
            <v-list-item-title class="text-h5 my-2">
            {{playerItems[0].name}} <span class="text-h6 font-weight-bold" > 56  <v-icon class="mb-3" color="orange"> mdi-food </v-icon> </span>
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-bold green--text">
                WINS : {{playerItems[0].nbWin}} <span class="font-weight-bold black--text"> | </span>
                <span class="red--text"> LOSSES : {{playerItems[0].nbLoss}} </span>
            </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile size="80">
            <v-img :src="require('@/assets/header/' + playerItems[0].avt)"> </v-img>
        </v-list-item-avatar>
        </v-list-item>
    </v-card>

    <v-card class="mt-6" max-width="700">
    <v-list-item>
      <v-list-item-content>
        <div class="text-overline text-center mb-4">
          Match History
        </div>
        <div v-for="ph in playerHistory" v-bind:key="ph.name" class="text-h text-center mb-3">
            {{playerItems[0].name}}
            <span v-if="ph.win==1" class="green--text"> has won against </span>
            <span v-if="ph.win==0" class="red--text"> has lose against </span>
            {{ph.name}}
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</v-cols>
</v-row>
</v-container>
</div>
</template>


<script lang="ts">
import Player from '@/components/header/Player.vue'

const playerItems = [
    {
        name: 'DUDE',
        avt: 'avatarExample.png',
        nbWin: 50,
        nbLoss: 26,
    }
]

const playerHistory = [
    { name: 'bill', win: 1 },
    { name: 'chevre', win: 0 },
    { name: 'MACRON', win: 0 },
    { name: 'plume', win: 1 }
]

export default {
    name: 'Profile',
    components: Player,
    data() {
        return {
            playerItems,
            playerHistory,
        }
    }
}
</script>
