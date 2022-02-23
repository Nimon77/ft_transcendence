<template>
    <v-card flat tile min-width="18%" class="d-flex flex-column" height="640px">
      <v-sheet color="green" min-height="100" dark width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> PLAYERS </span>
      </v-sheet>

      <v-list>
        <div v-for="player in players" :key="player.id">
        <v-list-group>
          <template v-slot:activator>
            <v-list-item-content class="mt-n4">
              <v-list-item-title> <v-badge dot inline color="blue"> </v-badge>{{player.name}}</v-list-item-title>
            </v-list-item-content>

          </template>

          <v-list-item dense>
              <v-list-item-title class="d-flex justify-center text-button">
                <v-btn color="blue" tile dark min-width="100%"> INVITE </v-btn>
              </v-list-item-title>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn color="blue" tile dark min-width="100%"> PROFILE </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn color="blue" tile dark min-width="100%" > MUTE </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title class="d-flex justify-center text-button">
              <v-btn color="blue" tile dark min-width="100%" > SET ADMIN </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-divider></v-divider>
      </div>
      </v-list>      
    </v-card>

</template>


<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
    name: 'PlayerChannel',
    data() {
        return {
          players: [
            {id: 0, name: "bill"},
            {id: 1, name: "john"},
            {id: 1, name: "john"},
            {id: 1, name: "john"},
            {id: 1, name: "john"},
          ],
          test: true,
          items: [
            {
              action: 'mdi-ticket',
              items: [{ title: 'List Item' }],
              title: 'Attractions',
            },
          ]
        }    
    },
})
</script>

<style scoped>


.v-list {
  display: flex !important;
  flex-direction: column;
  overflow: auto;
}
</style>