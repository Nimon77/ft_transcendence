<template>
  <div>
    <v-dialog style="margin-top: 12px !important" v-model="dialog" transition="dialog-top-transition"
    width="800" height="200" scrollable multiple>

      <template v-slot:activator="{ on, attrs }">
        <v-btn elevation="0" width="130" text dark style="font-size:20px" plain
        v-bind="attrs"
        v-on="on"
        v-on:click="fetchUsers">
            FRIENDS
            <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card dark>
        <v-card-title class="text-h5 grey darken-4">
          <v-text-field label="Search player" v-model="searchInput" clearable @click:clear="searchInput = null" autofocus></v-text-field>
        </v-card-title>

        <v-list v-if="searchInput == null || searchInput == ''"> <!-- "si je ne cherche rien, j'affiche les amis" -->
          <v-list-item-group>
            <v-list-item v-for="(friend) in me.followed" v-bind:key="friend">
              <v-list-item-content>
                <FriendDisplay :id="friend" :me="me" v-on:rmFriend="rmFriend" v-on:closedialog="closeDialog" :parentDialog="dialog" @close="dialog = false"/>
                <v-divider class="mt-2"></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-list v-else> <!-- "si je cherche un truc, j'affiche tout le monde sauf les amis" -->
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
      searchInput: null,
      dialog: false,
      added: false,
    }
  },
  methods: {
    closeDialog() {
      this.dialog=false;
    },
    rmFriend(rmId: number) {
      this.$http.put(`/user/me/follow/${rmId}`).then(() => {
        this.$http.get('/user/me').then(response => {
          this.me = response.data;
        });
      });
    },
    fetchUsers() {
      this.$http.get('/user').then(response => {
        this.listUsers = response.data;
      });
    }
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    me: {
      get() {
        return this.$store.getters.getUser;
      },
      set(value) {
        this.$store.commit('setUser', value);
      }
    },
    listUsers: {
      get() {
        return this.$store.getters.getListUsers;
      },
      set(value) {
        this.$store.commit('setListUsers', value);
      }
    },
    filteredUsers(): unknown {
      let cleanUsers;
      cleanUsers = this.listUsers.filter((user) => {
        if (this.me.followed.indexOf(user.id) == -1 && user.id != this.me.id)
          return true;
        else
          return false;
      });
      cleanUsers = cleanUsers.filter((user) => {
        if (user.username == null)
          return false;
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
