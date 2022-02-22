<template>
<v-btn v-on:click="deleteAccount" color="blue" dark max-width="160"> Delete Account </v-btn>
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
            async deleteAccount() {
                console.log("DELETE ACCOUNT");
                await this.$http.delete('/user/me').then((response) => {
                    console.log(response.data);
                })
            } 
        }
    });
</script>

<style scoped>

</style>
