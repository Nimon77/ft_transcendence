
<template>
  <v-app>
    <img v-for="n in 15" :key="n" src="@/assets/banane-resize.png" class="bananane" style=""/>
    <Header v-if="isReady"/>
    <v-main class="yellow">
      <transition name="bounce" mode="out-in">
        <router-view>
        </router-view>
      </transition>
    </v-main>
    <Footer v-if="isReady"/>
  </v-app>
</template>

<script lang="ts">
  import Header from './components/header/Header.vue'
  import Footer from './components/Footer.vue'

  export default {
    components: {
      Header,
      Footer,
    },
    computed: {
      isReady(): boolean {
        return this.$store.getters.getReady;
      }
    },
    mounted(): void {
      const bananes = document.querySelectorAll<HTMLElement>('.bananane');
      bananes.forEach((banane) => {
        var posXAl = Math.random() * (window.innerWidth - 150);
        posXAl = Math.floor(posXAl);
        banane.style.left = posXAl + "px";
        const width = Math.floor(Math.random() * (300 - 100 + 1) + 100)
        banane.style.width = width + "px";
        banane.style.animationDelay = Math.floor(Math.random() * 10) + "s";
        banane.style.animationDuration = Math.floor(Math.random() * (7 - 3 + 1) + 3) + "s";
        banane.style.filter = "blur(" + Math.pow(width / 125, 2) + "px)";
        banane.style.animationTimingFunction = "linear";
        banane.style.animationIterationCount = "infinite";
      });
    }
  };
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
    transition: opacity .2s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.twbtn {
  margin-top: 200px;
  /* margin-left: -45px; */
}


.bananane {
  position: absolute;
  top: -300px;
  /* width: 200px; */
  height: auto;
  overflow: hidden;
  animation: chute 4s infinite linear;
}

@keyframes chute {
  0% {
    transform: translateY(0);
    /* opacity: 1; */
  }
  75% {
    transform: translateY(calc(75vh + 150px));
    /* opacity: 1; */
  }
  100% {
    transform: translateY(calc(100vh + 200px));
    /* opacity: 0.5; */
  }
}

</style>

/*
Note/bugs:

channels
  -click sur channel root sur url type /community/:idChannel=2
  -je sais quel channel est selectionné et peut donc accéder aux infos

-trier la liste de user (pas de me + followed)
-ajouter option dialog sur channel items + faire ressortir les dots

-TWO F AUTHENTICATION
-SPECTATE
-CHAT ONE-TO-ONE
-INVITE TO GAME
-PREGAME
-GAME

-endgame screen
-button de retour doit set une alerte et faire quitter la game
-les msg de joueur bloques ne doivent pas s'afficher dans le chat/channel
-ownersChannels peuvent pas etre mute/ban/kick





Handling lags or disconnects in an efficient way is appreciated but not mandatory: 
- Have the game pause for a set time 
- Disconnected user can reconnect 
- Lagging user can catch up to the match 
- etc 
Any way is acceptable, your game simply must not crash. 
*/
