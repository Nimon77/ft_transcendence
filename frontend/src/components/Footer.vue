<template>
  <v-footer app padless>
    <v-col
      class="text-center green darken-1 white--text"
      cols="12"
    >
      {{ new Date().getFullYear() }} — <strong>BananaPong Inc.</strong>
    </v-col>
  </v-footer>
</template>

<script  lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'Footer',
})
</script>
