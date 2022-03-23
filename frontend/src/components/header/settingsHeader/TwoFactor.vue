<template>
  <v-dialog transition="scale-transition" max-width="400" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="blue" dark max-width="160"> TWO-FACTOR-AUTH </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card dark>
        <v-toolbar color="primary" elevation="0" class="text-h5 pl-5" dark>TWO FACTOR AUTH SETUP</v-toolbar>
        <v-card-text>
          <v-container fluid v-if="!otpSetup">
            <v-row>
              <v-col align="center" cols="12" class="mt-11" >
                <img :src="qrCode" alt="qrCode" class="mt-5">
                <h3>Verification code :</h3>
                <v-otp-input
                  v-model="otp"
                  :disabled="loading"
                  @finish="validate"
                ></v-otp-input>
                <v-overlay absolute :value="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-overlay>
              </v-col>
            </v-row>
          </v-container>
          <v-container fluid v-else>
            <v-row>
              <v-col align="center" cols="12" class="mt-11" >
                <h2>Two-factor authentication is enabled</h2>
                <v-spacer></v-spacer>
                <v-btn class="mt-5" color="red" dark @click="disableOtp" >DISABLE</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" dark @click="otp = ''; dialog.value = false" >CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TwoFactor',

  data(): unknown {
    return {
        qrCode: '',
        otp: '',
        loading: false,
        otpSetup: false,
    }
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user;
      },
      set(value) {
        console.log('set user', value);
        this.$store.commit('setUser', value);
      },
    },
  },
  methods: {
    validate () {
      this.loading = true
      this.$http.post('/auth/2fa', { "code": this.otp }).then(() => {
        this.$http.get('/auth/2fa/me').then((response) => {
          this.otpSetup = response.data;
          this.$toast.success('Two-factor authentication is enabled', {
            position: 'top-center',
            timeout: 3000,
          });
          this.loading = false;
          this.otp = '';
        });
      }).catch(() => {
        this.$toast.error('Invalid OTP code', {
          position: 'top-center',
          timeout: 3000,
        });
        this.loading = false;
        this.otp = '';
      });
    },
    disableOtp() {
      this.$http.delete('auth/2fa').then(() => {
        this.$http.get('auth/2fa/me').then((response) => {
          this.otpSetup = response.data;
          if (!this.otpSetup) {
            this.$toast.success('Two-factor authentication disabled', {
              position: 'top-center',
              timeout: 3000,
            });
            this.$http.get('/auth/2fa/qrcode').then(response => {
              this.qrCode = response.data;
            });
          }
        });
      });
    }
  },
  mounted() {
    // this.otpSetup = this.user.otp ? true : false;
    this.$http.get('/auth/2fa/me').then(response => {
      this.otpSetup = response.data;
      if (!this.otpSetup) {
        this.$http.get('/auth/2fa/qrcode').then(response => {
            this.qrCode = response.data;
        });
      }
    });
  }
});
</script>

<style scoped>

</style>
