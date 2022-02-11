
<template>
  <v-container fluid>
    <v-row class="my-16" style="justify-content: center;">
      <v-col cols="2" >
        
        <v-dialog width="500" max-height="500" v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
          <v-btn
          v-bind="attrs"
          v-on="on"          
          slot="activator"
          class="btn" color="yellow--text"
          tile x-large depressed
          width="295" height="90">
          PLAY
          </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <div style="margin-left: 120px">
                <h3 class="headline">Searching for player...</h3>
              <div style="margin-left: 95px; margin-top: 30px; margin-bottom: 20px;"> <v-progress-circular indeterminate color="grey"></v-progress-circular> </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn @click="dialog=false" style="margin-left: 200px" elevation="0" dark color="red">CANCEL</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn router to="/community" class="btn" color="yellow--text" tile x-large depressed width="295" height="90"> COMMUNITY </v-btn>
      
      </v-col>
    </v-row>
  </v-container> 
</template>


<script>
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

  export default {
    name: 'Main',
    data () {
      return {
        dialog: false,
      }
    },
    methods: {
      test() {
        console.log("BONJOUR");
        sleep(2000);
        console.log("i've slept now");
      }
    }
  }
</script>

<style scoped>
@import '../assets/fonts/LEMONMILK/stylesheet.css';

/* .ctn { max-width: 4000px; } */
/* p + p { margin-top: 30px; } */

.btn {
  font-family: "lemon_milkmedium";
  font-size: 30px !important;
  letter-spacing: 0.1em;
  margin-top: 20px;
  /* transform: scale(2); */
}
</style>