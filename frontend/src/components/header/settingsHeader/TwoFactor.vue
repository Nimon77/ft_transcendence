<template>
<v-btn v-on:click="test" color="blue" dark max-width="160"> Two-Factor-Auth </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
        name: 'TwoFactor',
        components: {

        },
        data(): unknown {
            return {

            }
        },
        methods: {
            test(): void {
                console.log('Two-Factor-Auth'); // TODO: remove
            } 
        }
    });
</script>

<style scoped>

</style>
