<template>
  <div id="app">
    <TaskList @editTask="editTask" />
    <TaskEditor v-if="editingTask" :id="taskToEdit" @closeEditor="editingTask = false" />
  </div>
</template>

<script>
import TaskList from "@/components/TaskList";
import TaskEditor from "@/components/TaskEditor";

export default {
  name: 'App',
  components: {
    TaskList,
    TaskEditor
  },
  data() {
    return {
      editingTask: false,
      taskToEdit: 0
    }
  },
  methods: {
    editTask(e) {
      this.taskToEdit = e.id
      this.editingTask = true
    }
  }
}
</script>

<style>
html {
  background-color: #FFE8D6;
  color: #36382e;
}

button {
  background-color: #ddd3a9;
  color: inherit;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 30px;
}
</style>
