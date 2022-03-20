<template>
<div>
  <v-container fluid>
    <v-row align="center">

        <v-badge bordered bottom left :color="status" offset-x="15" offset-y="15" >
          <v-avatar style="border: solid; border-color: white;" tile size="65" class="mr-2 border">
            <img :src="avatar" alt="Profile Picture"/>
          </v-avatar>
        </v-badge>
        <v-btn plain router :to="'/profile/' + user.id" class="name" text> {{user.username}} </v-btn>

        <v-menu offset-y>
        <template v-slot:activator="{ on, attrse }">
          <v-btn color="white" plain v-bind="attrse" v-on="on" small tile width="40" icon class="ml-2">
          <v-icon color="white" small> mdi-cogs </v-icon> <v-icon class="ml-n2" x-small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dark class="text-center">
          <v-list-item>
            <v-list-item-title> <ChangeAvatar/> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <TwoFactor/> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <DeleteAccount/> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <Logout/> </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-row>
  </v-container>

</div>
</template>

<script lang="ts">
import Vue from 'vue'

import ChangeAvatar from './settingsHeader/ChangeAvatar.vue'
import TwoFactor from './settingsHeader/TwoFactor.vue'
import DeleteAccount from './settingsHeader/DeleteAccount.vue'
import Logout from './settingsHeader/Logout.vue'

Vue.component('ChangeAvatar', ChangeAvatar)
Vue.component('TwoFactor', TwoFactor)
Vue.component('DeleteAccount', DeleteAccount)
Vue.component('Logout', Logout)

export default Vue.extend({
    name: 'Player',

    data() {
      return {
        items: [
        { title: 'Change Avatar' },
        { title: 'Two-Factor-Auth' },
        { title: 'Delete Account' },
        ],
        // user: [],
      }
    },
    computed: {
      user() {
        return this.$store.getters.getUser;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
      status() {
        if (this.user.status == 1)
          return 'blue';
        else if (this.user.status == 2)
          return 'orange';
        else if (this.user.status == 3)
          return 'green';
        else
          return 'grey';
      }
    }
  })
</script>

<style scoped>
.name {
    font-size: 150%;
    color: white;
    /* margin-top: 15px; */
    /* transform: scale(2.15); */
}

</style>
