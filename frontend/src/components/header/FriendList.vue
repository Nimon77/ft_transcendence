<template>
<div>
    <v-dialog style="margin-top: 12px !important" v-model="dialog" transition="dialog-top-transition"
    width="800" height="200" scrollable multiple>

      <template v-slot:activator="{ on, attrs}">
        <v-btn elevation="0" width="130" text dark style="font-size:20px"
        v-bind="attrs"
        v-on="on"
        v-on:click="fetchInfos">
            FRIENDS
            <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            <v-text-field label="Search player" v-model="searchInput" ></v-text-field>
          </v-card-title>

          <v-list v-if="searchInput == ''"> <!-- "si je ne cherche rien, j'affiche les amis" -->
                <v-list-item-group>
                  <v-list-item v-for="(friend, index) in friends" v-bind:key="index"> <!-- à changer pr afficher la friendList complete ss filter -->
                  <v-list-item-content>

                  <v-menu offset-y>
                    <template v-slot:activator="{on}">
                      <FriendDisplay v-on:click="on" :user="user" :id="friends.id"/>
                      <v-btn color="primary" dark v-on="on"> OPTIONS </v-btn>
                    </template>
                    <v-list class="text-center">
                      <v-list-item v-for="(item, index) in friendOptions" :key="index">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  
                  </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
          </v-list>

          <v-list v-if="searchInput != ''"> <!-- "si je cherche un truc, j'affiche les tout le monde sauf les amis" -->
            <v-list-item v-for="user in filteredUsers" v-bind:key="user.id">
              <v-list-item-content>
                <UserDisplay :user="user"/>
                <v-divider class="mt-1"></v-divider>
            </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
    </v-dialog>

</div>
</template>

<script lang="ts">
import Vue from "vue";
import FriendDisplay from './FriendDisplay.vue'
import UserDisplay from './UserDisplay.vue'

Vue.component('FriendDisplay', FriendDisplay);
Vue.component('UserDisplay', UserDisplay);

export default Vue.extend({
    data () {
      return {
        searchInput: "",
        dialog: false,
        users: [],
        friends: [],
        friendOptions: [
        { title: 'Profil Player' },
        { title: 'Invite to Game' },
        { title: 'Spectate' },
        { title: 'Chat' },
        { title: 'Remove Player' },
        ],
      }
    },
    methods: {
      validTempToken(): unknown {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDAyNyIsImlhdCI6MTY0NTEyNDQ4MSwiZXhwIjoxNjQ1NzI5MjgxfQ.EudjZqlqBVPWR0B1gyt6UZs46q_ZSqg6yLPpCPX9UT8';
      },
      // fetch all users + la friendlist
      async fetchInfos() { // retirer les amis des users !!
        await this.$http.get('/user').then(response => {
          this.users = response.data;
        });
        await this.$http.get('/user/me').then(response => {
          this.friends = response.data.friends;
        });
      },
    },
    computed: {
      filteredUsers(): unknown {
        return this.users.filter((user) => {
          return user.log.match(this.searchInput);
        })
      }
    }
})

</script>

<style scoped>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.v-btn {
  font-family: "lemon_milkmedium";
  font-size: 20px;
  /* margin-left: 60px; */
}
</style>
