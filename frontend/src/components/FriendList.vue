<template>
<div>
    <v-dialog
    style="margin-top: 12px !important"
    v-model="dialog"
    transition="dialog-top-transition"
    width="800"
    height="200"
    scrollable>
      
      <template v-slot:activator="{ on, attrs}">
        <v-btn elevation="0" width="130" text dark
        v-bind="attrs"
        v-on="on">
            FRIENDS
            <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            <v-text-field label="Search player"></v-text-field>
          </v-card-title>

          <v-list>
                <v-list-item-group v-model="model">
                  <v-list-item v->
                    <v-list-item-content>
                      {{Friends[1].Friend}}
                    </v-list-item-content>
                  </v-list-item>                  
                </v-list-item-group>
          </v-list>

          <Friend/>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script lang="ts">
import Friend from './Friend.vue'

export default {
    components: {
      Friend,
    },
    data () {
      return {
        dialog: false,
        Friends: [
          {
            Friend
          },
          {
            Friend
          },
        ]
      }
    }
}

</script>

<style scoped>
@import '../assets/fonts/LEMONMILK/stylesheet.css';

.v-btn {
  font-family: "lemon_milkmedium";
  font-size: 20px;
  /* margin-left: 60px; */
}
</style>