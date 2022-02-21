<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-auth-image="'/user/'+user.id+'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==0" color="grey">
      {{user.log}}
      </v-badge>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==1" color="blue">
      {{user.log}}
      </v-badge>

      <v-badge class="ml-3" inline left v-if="user.onlineStatus==2" color="red">
      {{user.log}} - in game
      </v-badge>
      <v-spacer></v-spacer>
      <v-btn dark @click="addStat" :id="user.id" :loading="loader" :color="color" height="60" width="60">
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
        loader: false,
        color: 'blue',
      }
    },
    methods: {
      async addStat() {
        this.loader = !this.loader;
        this.color = 'green';
        setTimeout(this.setDone, 500);
        await this.$http.post('/user/me/community', {id: this.user.id,}).then(response => {
          console.log('PUT REQUEST', response);
          });
        location.reload();
      },
      setDone(): void {
        document.getElementById(this.user.id).innerHTML = "DONE!";
        this.loader = false;
      },
    },
  })
</script>

<style scoped>
/* @import '../assets/fonts/LEMONMILK/stylesheet.css'; */


.name {
    font-family: "lemon_milkbold" !important;
    margin-left: 10px;
}

</style>
