<template>
<v-btn v-on:click="test" color="blue" dark max-width="160"> Two-Factor-Auth </v-btn>
</template>

<script lang="ts">
    export default {
        name: 'TwoFactor',
        components: {

        },
        data(): unknown {
            return {

            }
        },
        methods: {
            test(): void {
                console.log('Two-Factor-Auth');
            } 
        }
    };
</script>

<style scoped>

</style>