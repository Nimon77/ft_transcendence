<template>
<div>
  <v-container fluid>
    <v-row align="center">

        <v-avatar class="mr-n2" tile color="blue" size="65">
          <v-img src="../assets/header/RectangleWhite.png">
          </v-img>
        </v-avatar>
        <v-btn class="name" text width="150">
          <v-badge inline left color="blue"> </v-badge>
          STEVEE
        </v-btn>
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