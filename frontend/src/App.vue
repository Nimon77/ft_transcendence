
<template>
  <v-app>
    <Header v-if="isLogged()"/>
    <v-main class="yellow">
      <router-view></router-view>
    </v-main>
    <Footer v-if="isLogged()"/>
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
    methods: {
      isLogged(): boolean {
        return localStorage.getItem('profileCompleted') === 'true';
      }
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
-"searching for player dialog" => le dialog doit s'enlever seulement avec "cancel" pas avec click outside

profil players
  -click sur profil player root avec une url de query param type : /profile/:idPlayer=5
  -le component recup l'id et donc sait quels informations afficher de quel joueur!

de même pour les channels
  -click sur channel root sur url type /community/:idChannel=2
  -je sais quel channel est selectionné et peut donc accéder aux infos

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
