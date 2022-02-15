
<template>
  <v-container fluid>
    <v-row class="my-16" style="justify-content: center;">
      <v-col cols="2" >
        <PlayButton/>
        <v-btn router to="/community" class="btn" color="yellow--text" tile x-large depressed width="295" height="90"> COMMUNITY </v-btn>
        <v-btn v-on:click="fetchUsers" class="btn" color="yellow--text" tile x-large depressed width="595" height="90"> TEST DE RECUP DES DONNEES </v-btn>
      
      </v-col>
    </v-row>
  </v-container> 
</template>


<script lang="ts">

  import PlayButton from './PlayButton.vue'

  export default {
    name: 'Main',
    components: {
      PlayButton,
    },
    data (): unknown {
      return {
      info: []
      }
    },
    methods: {
    async fetchUsers(): Promise<void>  {
        const baseURI = 'http://localhost:3000/user'
        await this.$http.get(baseURI).then((result) => { this.info = result.data })
        console.log('RESULT.DATA ', this.info[8].id);
      }
    }
  }
</script>

<style>
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