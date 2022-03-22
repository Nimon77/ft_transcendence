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
                  @finish="onFinish"
                ></v-otp-input>
                <v-overlay absolute :value="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-overlay>
              </v-col>
            </v-row>
            <v-snackbar v-model="snackbar" tile outlined color="red">
              <!-- <v-btn color="red" text @click="snackbar = false">Close</v-btn> -->
              {{ snackbarText }}
            </v-snackbar>
          </v-container>
          <v-container fluid v-else>
            <v-row>
              <v-col align="center" cols="12" class="mt-11" >
                <h2>Two-factor authentication is enabled</h2>
                <v-spacer></v-spacer>
                <v-btn color="red" dark @click="disableOtp" >DISABLE</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" dark @click="otp = ''; dialog.value = false" >CANCEL</v-btn>
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
        snackbarText: '',
        snackbar: false,
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
    onFinish () {
      this.loading = true
      this.$http.post('/auth/2fa', { "code": this.otp }).then(() => {
        this.$http.get('/user/me').then((response) => {
          this.user = response.data;
          this.otpSetup = true;
          this.loading = false;
          this.otp = '';
        });
      }).catch(() => {
        this.loading = false;
        this.snackbarText = 'Invalid code';
        this.snackbar = true;
      });
    },
    disableOtp() {
      this.$http.delete('auth/2fa').then(() => {
        this.$http.get('/user/me').then((response) => {
          this.user = response.data;
          this.$http.get('/auth/2fa/qrcode').then(response => {
            this.qrCode = response.data;
            this.otpSetup = false;
          });
        });
      });
    }
  },
  mounted() {
    this.otpSetup = this.user.otp ? true : false;
    if (!this.otpSetup) {
      this.$http.get('/auth/2fa/qrcode').then(response => {
          this.qrCode = response.data;
      });
    }
  }
});
</script>

<style scoped>

</style>
