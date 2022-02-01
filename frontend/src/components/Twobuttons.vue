
<template>
  <v-container fluid class="ctn">
    <v-row style="justify-content: center;">
      <v-col cols="2" >
        <p> <v-btn color="primary" tile large depressed width="175" height="75"> PLAY </v-btn> </p>
        <p> <v-btn color="primary" tile large depressed width="175" height="75"> COMMUNITY </v-btn> </p>
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
.ctn { max-width: 800px; }
p + p { margin-top: 10px; }
</style>