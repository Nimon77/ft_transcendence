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
            <v-list-item-title> <v-btn color="blue" dark max-width="160"> Change Avatar </v-btn> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <v-btn color="blue" dark max-width="160"> Two-Factor-Auth </v-btn> </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <v-btn color="blue" dark max-width="160"> Delete Account </v-btn> </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-row>
  </v-container>

</div>
</template>

<script>
  export default {
    name: 'Player',
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