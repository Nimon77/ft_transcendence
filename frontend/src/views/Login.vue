<template>
  <v-container fill-height fluid>
    <img v-for="n in 15" :key="n" src="@/assets/banane-resize.png" class="bananane" style=""/>
    <v-row>
      <v-col align="center">
        <div class="white--text text-h1 mb-15 font-weight-bold">BANANAPONG</div>
        <v-btn
          :href="url"
          class="subheading mx-3 white--text"
          outlined
          x-large
        >
          <v-img
            src="https://projects.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg"
            alt="42"
            width="2em"
            height="2em"
            contain>
          </v-img>
          <span class="mx-1">Login</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',

  data: () => ({
    url: `http://${location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/auth/42/callback`,
    window: {
      width: 0,
      height: 0,
    },
  }),
  mounted () {
    const bananes = document.querySelectorAll<HTMLElement>('.bananane');
    bananes.forEach((banane) => {
      var posXAl = Math.random() * (window.innerWidth - 150);
      posXAl = Math.floor(posXAl);
      banane.style.left = posXAl + "px";
      banane.style.animationDelay = Math.floor(Math.random() * 10) + "s";
      banane.style.animationDuration = Math.floor(Math.random() * (7 - 3 + 1) + 3) + "s";
      console.log("animationDelay", banane.style.animationDelay);
      console.log("animationDuration", banane.style.animationDuration);
      banane.style.animationTimingFunction = "linear";
      banane.style.animationIterationCount = "infinite";
    });
  }
});
</script>

<style scoped lang="css">
html, body {
  width: 100%;
  height: 100%;
  position: absolute;
}
  .text-h1 {
    font-size: 8rem;
  }

  .bananane {
    position: absolute;
    top: -100px;
    width: 200px;
    height: auto;
    overflow: hidden;
    animation: chute 4s infinite linear;
  }

  @keyframes chute {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    75% {
      transform: translateY(calc(75vh));
      opacity: 1;
    }
    100% {
      transform: translateY(calc(100vh));
      opacity: 0.5;
    }
  }

</style>
