<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-if="user.id !== undefined" v-auth-image="'/user/'+user.id+'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left color="blue">
      {{user.username}}
      </v-badge>
      <v-spacer></v-spacer>
      <v-btn class="mr-3" @click="block" dark color="red" height="60" width="80">
        <div id="blockButton"> BLOCK </div> 
      </v-btn>
      <v-btn @click="addStat" class="white--text" :id="user.id" :disabled="disabledAdd" :loading="loader" :color="color" height="60" width="60">
        ADD
      </v-btn>
    </v-row>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'UserDisplay',
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data(): unknown {
      return {
        disabledAdd: false,
        loader: false,
        color: 'blue',
      }
    },
    computed: {
      me: {
        get() {
          return this.$store.getters.getUser;
        },
        set(user: unknown) {
          this.$store.commit('setUser', user);
        },
      },
    },
    methods: {
      async block() {
        await this.$http.post('/user/me/block', {id: this.user.id,}).then(response => {
          console.log('BLOCK REQUEST', response);
          });
        this.disabledAdd = !this.disabledAdd;
        if (this.disabledAdd == false)
          document.getElementById('blockButton').innerHTML = "BLOCK";
        else
          document.getElementById('blockButton').innerHTML = "UNBLOCK";
      },
      async addStat() {
        this.loader = !this.loader;
        this.color = 'green';
        setTimeout(this.setDone, 500);
        await this.$http.post('/user/me/follow', {id: this.user.id,}).then(response => {
          console.log('PUT REQUEST', response);
          });
        await this.$http.get('/user/me').then(response => {
          console.log('GET REQUEST', response);
          this.me = response.data;
        });
        this.$emit('added');
      },
      setDone(): void {
        // document.getElementById(this.user.id).innerHTML = "DONE!";
        this.loader = false;
      },
    },
    mounted() {
      // for (let i in this.me.blocked)
      // {
        if (this.me.blocked.indexOf(this.user.id) != -1) // si le user est bloque
        {
          this.disabledAdd = true;
          document.getElementById('blockButton').innerHTML = "UNBLOCK";
        }
      // }
    }
})
</script>

<style scoped>
/* @import '../assets/fonts/LEMONMILK/stylesheet.css'; */


.name {
    font-family: "lemon_milkbold" !important;
    margin-left: 10px;
}

</style>
