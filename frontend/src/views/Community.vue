<template>
    <v-container fluid class="mt-1">
    <v-row justify="center">
    <Channel/>
    <Chat/>
    <PlayerChannel/>
  </v-row>
  </v-container>
</template>

<script>
  import Chat from '@/components/community/Chat.vue'
  import Channel from '@/components/community/Channel.vue'
  import PlayerChannel from '@/components/community/PlayerChannel.vue'
  
  export default {
    components: {
      Chat,
      Channel,
      PlayerChannel,
    },
    data: () => ({ drawer: null }),
  }
</script>

<style >

@import '~@/assets/fonts/LEMONMILK/stylesheet.css';

.span {
  font-family: "lemon_milkmedium";
  font-size: 30px;
  letter-spacing: 0.1em;
  /* margin-left: 60px; */
}

.btn:hover {
    transform: scale(1.1)
}

</style>
