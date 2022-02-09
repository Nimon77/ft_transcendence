<template>
<div>
    <v-card
        class="mx-16 mt-12"
        max-width="344"
    >
        <v-list-item three-line>
        <v-list-item-content>
            <div class="text-overline mb-4">
            Player Profile
            </div>
            <v-list-item-title class="text-h5 mb-1">
            {{playerItems[0].name}}
            </v-list-item-title>
            <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar
            tile
            size="80"
        >
            <v-img :src="require('../../assets/header/' + playerItems[0].avt)">
            </v-img>
        </v-list-item-avatar>
        </v-list-item>
    </v-card>

<!-- IN V-ROW! -->
    <v-card
    class="mt-left"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">
          OVERLINE
        </div>
        <v-list-item-title class="text-h5 mb-1">
          Headline 5
        </v-list-item-title>
        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn
        outlined
        rounded
        text
      >
        Button
      </v-btn>
    </v-card-actions>
  </v-card>
</div>
</template>


<script lang="ts">
import Player from '../Player.vue'

const playerItems = [
    {
        name: 'DUDE',
        avt: 'avatarExample.png'
    }
]

export default {
    name: 'ProfilPlayer',
    components: Player,
    data() {
        return {
            playerItems,
        }
    }
}
</script>