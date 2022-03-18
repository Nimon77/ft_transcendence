<template>
  <v-container>
    <v-row>
      {{ message }}
    </v-row>
    <v-row>
      <v-btn
        tile
        @click="clicked"
      >
        Accept
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';

export default Vue.extend({
  name: 'InvitePlayer',
  computed: {
    message() {
      return store.getters.getNotify.message;
    },
  },
  methods: {
    clicked() {
      // const payload = {
      //   id: store.getters.getNotify.sender,
      //   sender: store.getters.getUser.id,
      //   message: store.getters.getUser.username + " has invited you to play",
      //   roomCode: store.getters.getNotify.roomCode
      // };
      // this.$socket.emit('notify', payload);
      alert(store.getters.getNotify.roomCode);
    }
  }
});
</script>
