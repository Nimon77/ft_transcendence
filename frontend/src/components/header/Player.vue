<template>
<div>
  <v-container fluid>
    <v-row align="center">

        <v-badge bordered bottom left color="blue" offset-x="15" offset-y="15" >
        <v-avatar tile color="blue" size="65" class="mr-2">
          <v-img src="../../assets/header/RectangleWhite.png">
          </v-img>
        </v-avatar>
         </v-badge>
        <v-btn router to="/profilPlayer" class="name" text width="110"> STEVEE </v-btn>

        <v-menu open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="black" v-bind="attrs" v-on="on" small tile icon class="ml-2">
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

<script>
  import ChangeAvatar from './settingsHeader/ChangeAvatar.vue'
  import TwoFactor from './settingsHeader/TwoFactor.vue'
  import DeleteAccount from './settingsHeader/DeleteAccount.vue'

  export default {
    name: 'Player',
    components: {
      ChangeAvatar,
      TwoFactor,
      DeleteAccount,
    },

    data() {
      return {
        items: [
        { title: 'Change Avatar' },
        { title: 'Two-Factor-Auth' },
        { title: 'Delete Account' },
      ],
      }
    },
  }
</script>

<style scoped>

.name {
    font-size: 150%;
    color: white;
    /* margin-top: 15px; */
    /* transform: scale(2.15); */
}

</style>