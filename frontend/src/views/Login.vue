<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col align="center">
        <div class="white--text text-h1 mb-15 font-weight-bold">BANANAPONG</div>
        <v-btn
          :href="api42Url"
          target="_blank"
          class="subheading mx-3 white--text"
          outline
          color="primary"
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

<style scoped lang="scss">
  .text-h1 {
    font-size: 8rem;
  }
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',

  data: () => ({
  }),

  computed: {
    api42Url(): string {
      return `${process.env.VUE_APP_BACKEND_URL}/api/login/auth`;
    },
  },
});
</script>
