<template>
    <v-dialog transition="scale-transition" max-width="400" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item-title v-bind="attrs" v-on="on" color="blue" dark max-width="160"> Chat </v-list-item-title>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-form @submit.prevent="setNewInfos(dialog)" ref="form" v-model="valid">
              <v-toolbar color="primary" elevation="0" class="text-h5 pl-5" dark>DIRECT MESSAGE TO {{user.username}}</v-toolbar>
              <v-card-text>
                <v-container fluid>

                </v-container>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn color="red" dark @click="dialog.value = false" >CANCEL</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </template>
      </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DirectChat',
})
</script>
