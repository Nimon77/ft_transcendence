<template>
<!-- <v-btn v-on:click="deleteAccount" color="blue" dark max-width="160"> Delete Account </v-btn> -->
  <v-dialog transition="scale-transition" max-width="400" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="blue" dark max-width="160"> Logout </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card dark>
        <v-toolbar color="primary" elevation="0" class="text-h5 pl-5" dark>Would you like to logout ?</v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col align="center" cols="12" class="mt-11" >
                <h2>Are you sure you want to logout ?</h2>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" dark @click="dialog.value = false" >CANCEL</v-btn>
          <v-btn @click="dialog.value = false; logout();" >YES!</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Logout',
  components: {

  },
  data(): unknown {
      return {

      }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$store.commit('setUser', {});
      this.$store.commit('setReady', false);
      this.$store.getters.getNotifySocket.disconnect();
      this.$store.state.notifySocket = null;
      this.$router.push({ name: 'Login' });
    },
  },
});
</script>

<style scoped>

</style>
