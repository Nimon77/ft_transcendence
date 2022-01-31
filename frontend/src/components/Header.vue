<template>
    <header>
    <h1>{{title}}</h1>
    <Button text="AddClient"/>
    </header>
</template>

<script>
    import Button from './Button.vue'
    export default {
        name: 'Header',
        components: {
            Button,
        },
        props: {
            title: {
                type: String
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