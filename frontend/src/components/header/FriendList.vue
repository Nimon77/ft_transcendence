<template>
<div>
    <v-dialog
    style="margin-top: 12px !important"
    v-model="dialog"
    transition="dialog-top-transition"
    width="800"
    height="200"
    scrollable
    multiple>

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
            <v-text-field label="Search player"></v-text-field>
          </v-card-title>

          <v-list>
                <v-list-item-group>
                  <v-list-item v-for="friend in friends" v-bind:key="friend.id">

                  <v-list-item-content>
                  <v-menu offset-y>
                    <template v-slot:activator="{on}">
                      <FriendDisplay v-on:click="on" :pN="friend.playerName" :stat="friend.statut"/>
                      <v-btn
                        color="primary"
                        dark
                        v-on="on"
                      >
                        OPTIONS
                      </v-btn>
                    </template>
                    <v-list class="text-center">
                      <v-list-item
                        v-for="(item, index) in items"
                        :key="index"
                      >
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

const friends = [
  {id: 1, playerName: 'chèvre', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 0, route: /profilPlayer/},
  {id: 2, playerName: 'Byllyy34', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 2, route: /profilPlayer/},
  {id: 3, playerName: 'Gertrude', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 1, route: /profilPlayer/},
  {id: 4, playerName: 'AM GOD', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 0, route: /profilPlayer/},
  {id: 5, playerName: 'oke', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 2, route: /profilPlayer/},
  {id: 6, playerName: 'NOÏCE', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 1, route: /profilPlayer/},
  {id: 7, playerName: 'gneeee', avatarName: 'avatarExample.png', avatarFolder: '../assets/header/', statut: 2, route: /profilPlayer/},
];

export default {
    components: {
      FriendDisplay,
    },
    data () {
      return {
        dialog: false,
        friends,
        items: [
        { title: 'Profil Player' },
        { title: 'Invite to Game' },
        { title: 'Spectate' },
        { title: 'Chat' },
        { title: 'Remove Player' },
        ],
      }
    },
    computed: {
      imageSrc() {
        return {};
      }
    }
}

</script>

<style scoped>
@import '../../assets/fonts/LEMONMILK/stylesheet.css';

.v-btn {
  font-family: "lemon_milkmedium";
  font-size: 20px;
  /* margin-left: 60px; */
}
</style>