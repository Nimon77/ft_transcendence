<template>
    <header>
        <button>{{ buttonName }}</button>
    </header>
</template>

<script>
    export default {
        name: 'Button',
        props: ['buttonName'],
    }
</script> 