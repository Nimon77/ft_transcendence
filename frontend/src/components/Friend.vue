<template>
    <div>
        <v-container >
            <v-row align="center">
                <v-avatar class="mr-n2" tile size="65">
                    <v-img src="../assets/header/avatarExample.png"/>
                </v-avatar>

                <v-badge class="ml-3" inline left v-if="statut==0" color="grey">
                {{playerName}}
                </v-badge>

                <v-badge class="ml-3" inline left v-if="statut==1" color="blue">
                {{playerName}}
                </v-badge>

                <v-badge class="ml-3" inline left v-if="statut==2" color="red">
                {{playerName}}
                </v-badge>

            </v-row>
        </v-container>
    </div>
</template>

<script>
  export default {
    name: 'Friend',
    data() {
      return {
        playerName: 'Billyyyyy',
        avatar: '../assets/header/avatarExample.png',
        statut: 1, // 0 : disconnected | 1 : connected | 2 : in game
      }
    },
  }
</script>

<style scoped>
/* @import '../assets/fonts/LEMONMILK/stylesheet.css'; */


.name {
    font-family: "lemon_milkbold" !important;
    margin-left: 10px;
}

</style>