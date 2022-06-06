<template>
  <div id="app">
    <p class="section-header"><font-awesome-icon icon="calendar-day" />Dailies<span /></p>
    <!--suppress JSValidateTypes -->
    <TaskList :todos="dailyTasks" @editTask="editTask" :show-daily-prio="true" />
    <button @click="backlog = !backlog" class="section-header">
      <font-awesome-icon icon="archive" /> Backlog <font-awesome-icon :icon="backlog ? 'angle-up' : 'angle-down'" />
    </button>
    <!--suppress JSValidateTypes -->
    <TaskList v-if="backlog" :todos="todosSorted" @editTask="editTask" />
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
      backlog: false,
      editingTask: false,
      taskToEdit: 0
    }
  },
  computed: {
    todosSorted() {
      return this.$store.getters.todosByPriority
    },
    dailyTasks() {
      return this.$store.getters.dailies
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
.section-header {
  display: flex;
  justify-content: space-between;
  padding: 2pt 1em;
  background-color: #ddd3a9;
  border: ridge #B7B7A4;
  font-weight: bold;
  font-size: large;
}
button.section-header {
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 30px 10px;
}
</style>
