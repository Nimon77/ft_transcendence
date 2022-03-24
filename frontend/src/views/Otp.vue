<template>
  <v-container transition="scale-transition" fill-height fluid>
    <v-card max-width="400" class="center" dark>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Two-factor authentication</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="text-center">
        <h2>Enter your 2FA verification code</h2>
        <v-otp-input class="mt-5"
          v-model="otp"
          ref="otp"
          :disabled="loading"
          @finish="validate"
        ></v-otp-input>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-overlay>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Otp',

  data(): unknown {
    return {
      otp: '',
      loading: false,
    }
  },

  methods: {
    validate () {
      this.loading = true
      this.$http.post('/auth/otp', { token: localStorage.getItem('token'), code: this.otp }).then((response) => {
        localStorage.setItem('token', response.data);
        this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data;
        this.loading = false;
        this.$router.push({ name: 'Main' });
      }).catch(() => {
        this.loading = false;
        this.otp = '';
        this.$toast.error('Invalid code', {
          position: 'bottom-center',
          timeout: 3000,
        });
        this.$refs.otp.focus();
      });
    },
  },
});
</script>

<style scoped lang="css">

html, body {
	overflow: hidden !important
}

  .text-h1 {
    font-size: 8rem;
  }

</style>
