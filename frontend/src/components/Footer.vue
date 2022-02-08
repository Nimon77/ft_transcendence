<template>
  <v-footer app padless>
    <v-col
      class="text-center green"
      cols="12"
    >
      {{ new Date().getFullYear() }} — <strong>BananaPong Inc.</strong>
    </v-col>
  </v-footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {}
    },
}
</script>