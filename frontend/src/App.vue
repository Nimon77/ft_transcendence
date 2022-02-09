
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
-Est-ce que set des routes dans le header ca va afficher dans le main ? A test
-"searching for player dialog" => le dialog doit s'enlever seulement avec "cancel" pas avec click outside
-trouver moyen de rechercher parmi TOUS les joueurs
-ajouter bouton option avec menu
*/