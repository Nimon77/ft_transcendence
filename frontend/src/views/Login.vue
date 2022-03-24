<template>
  <v-container fill-height fluid>
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
            src="@/assets/42-logo-white.svg"
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
});
</script>

<style scoped>

html, body {
	overflow: hidden !important;
}

  .text-h1 {
    font-size: 8rem;
  }

</style>
