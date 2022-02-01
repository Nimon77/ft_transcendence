<template>
  <v-app>

    <v-app-bar app elevation="0" color="green">
      <h1 style="color: white">BananaPong</h1>
    </v-app-bar>

    <v-main >
      <Twobuttons style="margin-top: 200px;"/>
    </v-main>

  </v-app>
</template>

<script lang="ts">
  import Twobuttons from './components/Twobuttons.vue'

  export default {
    components: {
      Twobuttons,
    },
    data: () => {
      return {
        drawer: null
      }
    },
  };
</script>

