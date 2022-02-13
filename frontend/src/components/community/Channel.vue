<template>
    <v-card flat tile min-width="20%">
      <v-sheet color="green" dark height="100" width="100%" class="text-center">
      <v-divider class="pt-7"></v-divider>
      <span class="span"> CHANNELS </span>
      </v-sheet>
      
      <v-list-item-group mandatory shaped >
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>chan {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-card>
</template>


<script lang="ts">

export default {
    name: 'Channel',
    data() {
        return {

        }
    },
}
</script>
