<template>
  <v-footer app padless v-if="authenticated">
    <v-col
      class="text-center green"
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
    data() {
        return {
            authenticated: false,
        }
    },
    mounted() {
      this.authenticated = localStorage.getItem('token') !== null;
    },
})
</script>
