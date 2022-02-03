
<template>
  <v-app>

    <Header/>
    
    <v-main style="background-color:#F6D42A;">
      <Twobuttons class="twbtn"/>
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
  margin-top: 250px;
  /* transform: scale(1.75); */
}

</style>
