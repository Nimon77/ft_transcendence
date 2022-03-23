
<template>
  <v-app>
    <div name="banana-bg">
      <img v-for="n in 15" :key="n" src="@/assets/banane-resize.png" class="bananane" style=""/>
    </div>
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
    },
  },
  created(): void {
    window.addEventListener('resize', this.onResize);
  },
  mounted(): void {
    this.onResize();
  },
  methods: {
    onResize(): void {
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
    },
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
  top: -200px;
  height: auto;
  overflow: hidden;
  animation: chute 4s infinite linear;
}

@keyframes chute {
  0% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(calc(75vh + 150px));
  }
  100% {
    transform: translateY(calc(100vh + 200px));
  }
}

</style>
