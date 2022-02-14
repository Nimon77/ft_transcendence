<template>
    <!-- <template>
    <v-btn v-on:click="test" color="blue" dark max-width="160"> Change Avatar </v-btn>
    <template> -->

    <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" v-on:click="test" color="blue" dark max-width="160"> Change Avatar </v-btn>
          <!-- <v-btn color="primary" v-bind="attrs" v-on="on" >From the bottom</v-btn> -->
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >Opening from the bottom</v-toolbar>
            <v-card-text>
              <div class="text-h2 pa-12">Hello world!</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
</template>

<script lang="ts">
    export default {
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
    };
</script>

<style scoped>

</style>