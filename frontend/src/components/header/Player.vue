<template>
<div>
  <v-container fluid>
    <v-row align="center">

        <v-badge bordered bottom left color="blue" offset-x="15" offset-y="15" >
          <v-avatar style="border: solid; border-color: white;" tile coolor="blue" size="65" class="mr-2 border">
            <img v-auth-image="'/user/me/avatar'" alt="Profile Picture"/>
          </v-avatar>
        </v-badge>
        <v-btn router to="/profile" class="name" text> {{username}} </v-btn>

        <v-menu offset-y>
        <template v-slot:activator="{ on, attrse }">
          <v-btn color="black" v-bind="attrse" v-on="on" small tile width="40" icon class="ml-2">
          <v-icon small> mdi-cogs </v-icon> <v-icon class="ml-n2" x-small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="text-center">
          <v-list-item>
            <v-list-item-title> <ChangeAvatar/> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <TwoFactor/> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <DeleteAccount/> </v-list-item-title>
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

Vue.component('ChangeAvatar', ChangeAvatar)
Vue.component('TwoFactor', TwoFactor)
Vue.component('DeleteAccount', DeleteAccount)

export default Vue.extend({
    name: 'Player',

    data() {
      return {
        items: [
        { title: 'Change Avatar' },
        { title: 'Two-Factor-Auth' },
        { title: 'Delete Account' },
        ],
        username: '',
      }
    },
    mounted() {
      this.$http.get('/user/me').then(response => {
        this.username = response.data.username
      })
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
