<template>
  <v-container >
    <v-row align="center">
      <v-avatar class="mr-n2" tile size="65">
        <img v-if="user.id !== undefined" v-auth-image="'/user/'+user.id+'/avatar'"/>
      </v-avatar>

      <v-badge class="ml-3" inline left :color='getStatusColor'>
      {{user.username}}
      </v-badge>
      <v-spacer></v-spacer>
      <v-btn class="mr-3" @click="block" dark color="red" height="60" width="80">{{isPlayerBlocked(user.id)}}</v-btn>
      <v-btn @click="addStat" class="white--text" :id="user.id" :disabled="isPlayerBlocked(user.id) === 'UNBLOCK'" :loading="loader" :color="color" height="60" width="60">
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
    computed: {
      me: {
        get() {
          return this.$store.getters.getUser;
        },
        set(user: unknown) {
          this.$store.commit('setUser', user);
        },
      },
      getStatusColor() {
        if (this.user.status == 1)
          return 'blue';
        else if (this.user.status == 2)
          return 'orange';
        else if (this.user.status == 3)
          return '#49be25';
        else
          return 'grey';
      },
    },
    methods: {
      isPlayerBlocked(id: number) {
        if (this.me.blocked.includes(id))
          return 'UNBLOCK';
        else
          return 'BLOCK';
      },
      block() {
        this.$http.put(`/user/me/block/${this.user.id}`).then(() => {
          this.$http.get('/user/me').then((res) => {
            this.me = res.data;
          });
        });
      },
      addStat() {
        this.loader = !this.loader;
        this.color = 'green';
        this.$http.put(`/user/me/follow/${this.user.id}`).then(() => {
          this.$http.get('/user/me').then(response => {
            this.me = response.data;
            this.loader = false;
          });
        });
        this.$emit('added');
      },

    },
    mounted() {
      if (this.me.blocked.indexOf(this.user.id) != -1) // si le user est bloque
      {
        this.disabledAdd = true;
      }
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
