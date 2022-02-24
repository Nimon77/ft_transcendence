<template>
<v-menu offset-x>
    <template v-slot:activator="{ on, attrs }">
    <v-btn @click.prevent v-on="on" v-bind="attrs" icon> <v-icon >mdi-dots-vertical</v-icon> </v-btn>
    </template>
    <v-list>
    <v-list-item>
        <v-list-item-title @click="leaveRoom" class="text-center">Leave Channel</v-list-item-title>
    </v-list-item>
    <v-list-item> <!-- si admin ! -->
        <v-list-item-title class="text-center">Manage Password</v-list-item-title>
    </v-list-item>
    </v-list>
</v-menu>
</template>


<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
    name: 'OptionChannel',
    props: {

    },
    data() {
        return {

        }
    },
    methods: {
        leaveRoom() {
            console.log("LEAVE");
            this.$emit('leaveRoom');
        }
    },
    computed: {

    },

    // created() {

    // }
})
</script>

<style scoped>

</style>