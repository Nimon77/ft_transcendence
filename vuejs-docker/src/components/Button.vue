<template>
    <button v-on:click="onClick()" :style="{background: 'green'}">
        {{text}}
    </button>
</template>

<script>
    export default {
        name: 'Button',
        props: {
            text: String,
            color: String,
        },
        methods: {
            onClick() {
                this.$emit('add-task')
            }
        }
    }
</script>

<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
</style>
