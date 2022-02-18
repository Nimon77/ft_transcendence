
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
  import Header from './components/header/Header.vue'
  import Footer from './components/Footer.vue'

  export default {
    components: {
      Header,
      Footer
    },
    data: () => {
      return {

      }
    },
    mounted: () => {
      // console.log(localStorage.getItem('token'));
    },

    computed: {
      // theme() {
      //   return this.$vuetify.theme.dark ? 'dark' : 'light';
      // },
    }
  };
</script>

<style scoped>

  /* html { overflow-y: auto } */
/* .app {
  overflow: hidden;
} */

.twbtn {
  margin-top: 200px;
  /* margin-left: -45px; */
}

</style>

/*
Note/bugs:
-Au demarrage, faire en sorte que Main s'affiche
-"searching for player dialog" => le dialog doit s'enlever seulement avec "cancel" pas avec click outside
-friendlist => la recherche doit match exactement avec le joueur rechercher
-linker les elements du chat entre eux
il y aurait une route pour chaque channel !

-endgame screen
-button de retour doit set une alerte et faire quitter la game
-dialog pour chaque setting
-dialog pour chat
-les msg de joueur bloques ne doivent pas s'afficher dans le chat/channel
-ownersChannels peuvent pas etre mute/ban/kick
-add bouton ajout channel + dialog pour add/remove chan
-toast for invitation/removePlayer

-mettre les rules ds la page game

Handling lags or disconnects in an efficient way is appreciated but not mandatory: 
- Have the game pause for a set time 
- Disconnected user can reconnect 
- Lagging user can catch up to the match 
- etc 
Any way is acceptable, your game simply must not crash. 
*/
