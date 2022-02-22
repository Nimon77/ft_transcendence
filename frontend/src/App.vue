
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

channels
  -click sur channel root sur url type /community/:idChannel=2
  -je sais quel channel est selectionné et peut donc accéder aux infos

-TWO F AUTHENTICATION


-endgame screen
-button de retour doit set une alerte et faire quitter la game

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
