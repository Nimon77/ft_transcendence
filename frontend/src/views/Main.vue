
<template>
  <v-container fill-height key="gne">
    <v-row class="justify-center mb-16">
      <v-col class="d-flex justify-center" cols="12" >
        <PlayButton/>
      </v-col>
      <v-col class="d-flex justify-center" cols="12" >
        <v-btn router to="/community" class="btn" color="yellow--text" tile x-large depressed width="295" height="90"> COMMUNITY </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import Vue from 'vue';

import PlayButton from '@/components/PlayButton.vue'

Vue.component('PlayButton', PlayButton);

export default Vue.extend({
  name: 'Main',
  data (): unknown {
    return {
    info: []
    }
  },
})
</script>

<style>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';



.btn {
  font-family: "lemon_milkmedium";
  font-size: 30px !important;
  letter-spacing: 0.1em;
  margin-top: 20px;
  /* transform: scale(2); */
}
</style>
