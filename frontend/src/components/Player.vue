<template>
<div>
  <v-container fluid>
    <v-row align-sm="center">

        <v-avatar class="mr-n4" tile color="blue" size="65">
          <v-img src="../assets/header/RectangleWhite.png">
          </v-img>
        </v-avatar>
        <v-icon class="mr-n8" color="blue" size="70"> mdi-circle-small </v-icon>
        <v-btn class="name" text> STEVEE </v-btn>
    </v-row>
  </v-container>

</div>
</template>

<script>
  export default {
    name: 'Player',
    data() {
      return {
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