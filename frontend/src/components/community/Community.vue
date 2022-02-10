<template>
    <v-container class="mt-1">
    <v-row justify="center">
    <v-card flat tile v-model="drawer" min-width="20%">
      <v-sheet color="green" dark height="100" width="100%" class="text-center">
      <v-divider class="pt-4"></v-divider>
      <span class="span"> CHANNELS </span>
      </v-sheet>
      <v-list  shaped >
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>chan {{ n }}</v-list-item-title>
          </v-list-item-content>
            <!-- <v-divider></v-divider> -->
        </v-list-item>
      </v-list>
    </v-card>

    <Chat/>

    <v-card flat tile min-width="20%">
      <v-sheet color="green" height="100" dark width="100%" class="text-center">
      <v-divider class="pt-4"></v-divider>
      <span class="span"> PLAYERS </span>
      </v-sheet>
      <v-list>
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
            <!-- <v-divider></v-divider> -->
      </v-list>
    </v-card>

  </v-row>
  </v-container>
</template>

<script>
  import Chat from './Chat.vue'
  
  export default {
    components: {
      Chat,
    },
    data: () => ({ drawer: null }),
  }
</script>

<style scoped>

@import '../../assets/fonts/LEMONMILK/stylesheet.css';

.span {
  font-family: "lemon_milkmedium";
  font-size: 40px;
  letter-spacing: 0.2em;
  /* margin-left: 60px; */
}

</style>