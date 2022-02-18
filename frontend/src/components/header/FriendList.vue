<template>
<div>
    <v-dialog style="margin-top: 12px !important" v-model="dialog" transition="dialog-top-transition"
    width="800" height="200" scrollable multiple>

      <template v-slot:activator="{ on, attrs}">
        <v-btn elevation="0" width="130" text dark style="font-size:20px"
        v-bind="attrs"
        v-on="on"
        v-on:click="fetchUsers">
            FRIENDS
            <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            <v-text-field  label="Search player" ></v-text-field>
          </v-card-title>

          <v-list>
                <v-list-item-group>
                  <v-list-item v-for="user in users" v-bind:key="user.id">

                  <v-list-item-content>
                  <v-menu offset-y>
                    <template v-slot:activator="{on}">
                      <FriendDisplay v-on:click="on" :pN="user.log" :stat="user.onlineStatus"/>
                      <v-btn color="primary" dark v-on="on"> OPTIONS </v-btn>
                    </template>
                    <v-list class="text-center">
                      <v-list-item v-for="(item, index) in items" :key="index">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
          </v-list>
        </v-card>
    </v-dialog>

</div>
</template>

<script lang="ts">
import FriendDisplay from './FriendDisplay.vue'

export default {
    components: {
      FriendDisplay,
    },
    data () {
      return {
        searchInput: "",
        dialog: false,
        users: [],
        items: [
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

      async fetchUsers(): Promise<void>  {
      const baseURI = '/user'
      await this.$http.get(baseURI).then((result) => { this.users = result.data })
      // console.log('RESULT.DATA ', this.users);
      }
    },
    computed: {
      manageInput(searchInput): void {
        console.log('CHECK INPUT = ', searchInput);
        return searchInput;
      },
      imageSrc() {
        return {};
      }
    }
}

</script>

<style scoped>
@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.v-btn {
  font-family: "lemon_milkmedium";
  font-size: 20px;
  /* margin-left: 60px; */
}
</style>
