
<template>
  <v-app>
    <Header/>
    <v-main class="yellow">
      <router-view></router-view>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script lang="ts">
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'

  export default {
    components: {
      Header,
      Footer
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

/*
Note/bugs:
-Au demarrage, faire en sorte que Main s'affiche
-"searching for player dialog" => le dialog doit s'enlever seulement avec "cancel" pas avec click outside
-trouver moyen de rechercher parmi TOUS les joueurs
-linker les elements du chat entre eux
il y aurait une route pour chaque channel !

-page de pregame (use switch)
-game
-endscreen
-dialog poour chaque setting
-add bouton ajout channel + dialog pour add chan
*/