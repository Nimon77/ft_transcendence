<template>
<div>
    <v-dialog style="margin-top: 12px !important" v-model="dialog" transition="dialog-top-transition"
    width="800" height="200" scrollable multiple>

      <template v-slot:activator="{ on, attrs}">
        <v-btn elevation="0" width="130" text dark style="font-size:20px"
        v-bind="attrs"
        v-on="on">
            FRIENDS
            <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            <v-text-field label="Search player" v-model="searchInput" clearable @click:clear="clearMessage" autofocus></v-text-field>
          </v-card-title>

          <v-list v-if="searchInput == ''"> <!-- "si je ne cherche rien, j'affiche les amis" -->
                <v-list-item-group>
                  <v-list-item v-for="(friend) in me.friends" v-bind:key="friend"> <!-- à changer pr afficher la friendList complete ss filter -->
                  <v-list-item-content>
                    <FriendDisplay :id="friend" :me="me" v-on:rmFriend="rmFriend" v-on:closedialog="closeDialog"/>
                    <v-divider class="mt-2"></v-divider>
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
        searchInput: '',
        dialog: false,
        users: [],
        added: false,
      }
    },
    methods: {
      closeDialog() {
        this.dialog=false;
      },
      async rmFriend(rmId: number) {
        console.log("rmId = ", rmId); // TODO: remove
        await this.$http.post('/user/me/follow', {id: rmId,}).then(response => {
          console.log('POST REQUEST', response); // TODO: remove
          });
        await this.$http.get('/user/me').then(response => {
          this.me = response.data;
        });
      },
      clearMessage() {
        this.searchInput = '';
      },
    },
    // fetch all users + la friendlist
    async created() { // retirer les amis des users !!
      await this.$http.get('/user').then(response => {
        this.users = response.data;
        // console.log("USR IN FL", this.users); // TODO: remove
      });
      // console.log(this.me); // TODO: remove
    },
    computed: {
      me: {
        get() {
          return this.$store.getters.getUser;
        },
        set(value) {
          console.log("set me", value); // TODO: remove
          this.$store.commit('setUser', value);
        }
      },
      filteredUsers(): unknown {
        let cleanUsers;
        cleanUsers = this.users.filter((user) => {
          if (this.me.friends.indexOf(user.id) == -1 && user.id != this.me.id)
            return true;
          else
            return false;
        });
        cleanUsers = cleanUsers.filter((user) => {
          return user.username.match(this.searchInput);
        })
        return cleanUsers;
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
