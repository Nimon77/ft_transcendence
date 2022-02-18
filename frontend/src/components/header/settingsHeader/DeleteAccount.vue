<template>
<v-btn v-on:click="test" color="blue" dark max-width="160"> Delete Account </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
        name: 'DeleteAccount',
        components: {

        },
        data(): unknown {
            return {

            }
        },
        methods: {
            test(): void {
                console.log('DELETE ACCOUNT');
            } 
        }
    });
</script>

<style scoped>

</style>
