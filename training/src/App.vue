<template>
  <div>
    <Header title="Task Tracker" />
    <AddTask @add-task="AddTask" />
    <Tasks @toggle-reminder="toggleReminder" @delete-task="deleteTask" :tasks="tasks" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Tasks from './components/Tasks.vue'
import AddTask from './components/AddTask.vue'

export default {
  name: 'App',
  components: {
    Header,
    Tasks,
    AddTask,
  },
  data() {
    return {
      tasks: []
    }
  },
  methods: {
    // AddTask () {

    // },
    deleteTask (id) {
      if (confirm('Are you sure ?')) {
        this.tasks = this.tasks.filter((task) => task.id !== id)
      }
    },
    toggleReminder (id) {
      this.tasks = this.tasks.map((task) => task.id ? {...task, reminder: !task.reminder} : task)
      // console.log(this.tasks[0].reminder)
    },
  },
  created() {
    this.tasks = [
      {
        id: 1,
        text: 'Doctors Appointment',
        day: 'March 1st at 2:30pm',
        reminder: true,
      },
      {
        id: 2,
        text: 'Meeting at School',
        day: '34 feb 8pm',
        reminder: true,
      },
      {
        id: 3,
        text: 'gneeeeeee',
        day: 'date of gneeeeee',
        reminder: true,
      },
    ]
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
