<template>
    <!-- <template>
    <v-btn v-on:click="test" color="blue" dark max-width="160"> Change Avatar </v-btn>
    <template> -->

    <v-dialog transition="scale-transition" max-width="400" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" v-on:click="test" color="blue" dark max-width="160"> Avatar/Username </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>CHANGE YOUR THINGS HERE</v-toolbar>
            <v-card-text>
              <v-container fluid>
              <v-row>
              <v-col align="center" cols="12" class="mt-10" >
              <v-text-field label="new username" solo></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input label="new avatar" chips truncate-length="21" ></v-file-input>
              </v-col>
              </v-row>
              </v-container>
            </v-card-text>
            <!-- <v-img class="ml-16" width="60"  src="https://upload.wikimedia.org/wikipedia/commons/5/56/Paloma_brav%C3%ADa_%28Columba_livia%29%2C_Palacio_de_Nymphenburg%2C_M%C3%BAnich%2C_Alemania01.JPG">
            </v-img> -->
            <v-card-actions class="justify-end">
              <v-btn @click="dialog.value = false" >OK!</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
        name: 'ChangeAvatar',
        components: {

        },
        data(): unknown {
            return {

            }
        },
        methods: {
            test(): void {
                console.log('CHANGE AVATAR');
            } 
        }
    });
</script>

<style scoped>

</style>
