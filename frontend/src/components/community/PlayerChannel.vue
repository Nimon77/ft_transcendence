<template>
    <v-card flat tile min-width="20%">
      <v-sheet color="green" height="100" dark width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> PLAYERS </span>
      </v-sheet>
      <v-list>
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
</template>


<script lang="ts">

export default {
    name: 'PlayerChannel',
    data() {
        return {

        }        
    },
}
</script>
