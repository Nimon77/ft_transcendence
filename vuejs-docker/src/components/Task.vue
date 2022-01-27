<template>
    <div>
        <h3>
            {{ task.text }}
            <i @click="onDelete(task.id)" style="background: red"> delete </i>
        </h3>
        <p> {{task.day}} </p>
    </div>
</template>

<script>
  export default {
    name: 'Task',
    props: {
        task: Object
    },
    methods: {
        onDelete (id) {
            console.log(id);
            return;
        }
    },
  }
</script>

<style>
</style>