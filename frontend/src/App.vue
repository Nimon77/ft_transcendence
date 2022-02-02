
<template>
  <v-app>

    <Header/>
    
    <v-main >
      <v-img src="./assets/main/Background.png" style="height:100%">
      <Twobuttons class="twbtn"/>
      </v-img>
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
  margin-top: 300px;
  transform: scale(1.75);
}

</style>
