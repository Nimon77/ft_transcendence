<template>
    <div>
    <v-navigation-drawer v-model="drawer" width="25%" app clipped>
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

    <v-navigation-drawer app clipped right width="25%">
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

    
      <v-card class="mx-auto" color="white" max-width="680" height="680">
        <v-card-title class="text-center">
          GNE
        </v-card-title>
        <v-card-actions>
        <v-app-bar bottom color="rgba(0,0,0,0)" flat>
              <v-text-field
              
              v-model="message"
              append-outer-icon="mdi-send"
              filled
              clear-icon="mdi-close-circle"
              label="Message"
              type="text"
            ></v-text-field>
        </v-app-bar>
      </v-card-actions>
      </v-card>
  
      <!-- <v-card class="mt-10 mr-2" max-width="350px" color="blue" dark>
        <v-list-item three-line>
          <v-list-item-content>
            <div class=" mb-4">
              GNE
            </div>
            <v-list-item-subtitle>2 mins ago <span class="ml-16">Seen 1:23PM</span></v-list-item-subtitle>  
          </v-list-item-content>
        </v-list-item>
      </v-card > -->

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