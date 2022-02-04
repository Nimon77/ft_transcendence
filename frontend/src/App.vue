
<template>
  <v-app>

    <Header/>
    
    <v-main class="yellow">
      <Twobuttons class="text-center mt-16"/>
    </v-main>

  </v-app>
</template>

<script lang="ts">
  import Twobuttons from './components/Twobuttons.vue'
  import Header from './components/Header.vue'

  export default {
    components: {
      Twobuttons,
      Header,
    },
    data: () => {
      return {
        drawer: null
      }
    },
  };
</script>

<style scoped>

.twbtn {
  margin-top: 200px;
  /* margin-left: -45px; */
}

</style>
