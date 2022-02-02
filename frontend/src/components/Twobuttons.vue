
<template>
  <v-container fluid class="ctn">
    <v-row style="justify-content: center;">
      <v-col cols="2" >
        <p> <v-btn class="btn" color="yellow--text" tile x-large depressed width="175" height="75"> PLAY </v-btn> </p>
        <p> <v-btn class="btn" color="yellow--text" tile x-large depressed width="175" height="75"> COMMUNITY </v-btn> </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Twobuttons',
    data: () => ({

    }),
  }
</script>

<style scoped>
@import '../assets/fonts/LEMONMILK/stylesheet.css';

.ctn { max-width: 1000px; }
p + p { margin-top: 30px; }

.btn {
  font-family: "lemon_milkmedium";
  letter-spacing: 0.1em;
  transform: scale(1.15);
}
</style>