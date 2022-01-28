<template>
    <div @dblclick="$emit('toggle-reminder', task.id)">
        <h3>
            {{ task.text }}
            <i @click="$emit('delete-task', task.id)" style="background: red"> delete </i>
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
  }
</script>

<style>
</style>