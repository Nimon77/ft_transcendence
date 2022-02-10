<template>
    <div>
    <v-navigation-drawer v-model="drawer" width="30%" app clipped>
      <v-sheet color="green" dark height="100" width="100%" class="text-center">
      <v-divider class="pt-4"></v-divider>
      <span class="span"> CHANNELS </span>
      </v-sheet>
      <v-list  shaped >
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>chan {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer app clipped right width="30%">
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
      </v-list>
    </v-navigation-drawer>

 

      <v-text-field
        background-color="grey lighten-1"
        dense
        flat
        hide-details
        rounded
        solo
      ></v-text-field>
</div>
</template>

<script>
  export default {
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