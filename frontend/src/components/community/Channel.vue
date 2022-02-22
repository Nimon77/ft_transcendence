<template>
    <v-card flat tile min-width="20%" height="100%" class="d-flex flex-column">
      <v-sheet color="green" dark height="100" width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> CHANNELS </span>
      </v-sheet>
        <v-btn class="ma-1" color="green" bottom tile left  @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-divider class="mt-1"></v-divider>
  

 <v-virtual-scroll :items="channels" item-height="50" height="300" >
      <template v-slot:default="{ channels }">
        <v-list-item>
          <v-list-item-content :key="channels.id" :value="channels.id">
            <v-list-item-title> gnneee {{ channels.id }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>
    </v-card>
</template>


<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
    name: 'Channel',
    data() {
        return {
          channels : [
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            { id: 2 },
            ]
        }
    },
})
</script>
