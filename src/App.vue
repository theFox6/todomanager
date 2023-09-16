<template>
  <div id="app">
    <!--TODO: only show archive button in backlog and archive-->
    <!--perhaps add a background around sections-->
    <p class="section-header"><font-awesome-icon icon="calendar-day" />Dailies<span /></p>
    <!--suppress JSValidateTypes -->
    <TaskList :todos="dailyTasks" :show-daily-prio="true" @editTask="editTask" />
    <div v-if="anyOverdue">
      <p class="section-header"><font-awesome-icon icon="exclamation-circle" />Overdue<span /></p>
      <TaskList :todos="overdueTasks" :show-daily-prio="true" :show-add-button="false" @editTask="editTask" />
    </div>
    <button class="section-header" @click="backlog = !backlog">
      <font-awesome-icon icon="archive" /> Backlog <font-awesome-icon :icon="backlog ? 'angle-up' : 'angle-down'" />
    </button>
    <!--suppress JSValidateTypes -->
    <TaskList v-if="backlog" :todos="todosBacklog" @editTask="editTask" />
    <!--TODO: add some space even when backlog is collapsed-->
    <button class="section-header" @click="listArchives = !listArchives">
      <font-awesome-icon icon="boxes-stacked" /> Archived <font-awesome-icon :icon="listArchives ? 'angle-up' : 'angle-down'" />
    </button>
    <!--TODO: list archives individually-->
    <TaskList v-if="listArchives" :todos="todosArchived" :show-add-button="false" @edit-task="editTask" />
    <p class="section-header"><font-awesome-icon icon="gears" />Actions<span /></p>
    <ActionBar />
    <TaskEditor v-if="editingTask" :id="taskToEdit" @closeEditor="editingTask = false" />
  </div>
</template>

<script>
import TaskList from "@/components/TaskList";
import TaskEditor from "@/components/TaskEditor";
import ActionBar from "@/components/ActionBar.vue";

export default {
  name: 'App',
  components: {
    ActionBar,
    TaskList,
    TaskEditor
  },
  data() {
    return {
      backlog: false,
      listArchives: false,
      editingTask: false,
      taskToEdit: 0
    }
  },
  computed: {
    todosBacklog() {
      return this.$store.getters.backlogTodos
    },
    dailyTasks() {
      return this.$store.getters.dailies
    },
    todosArchived() {
      return this.$store.getters.archivedTodos
    },
    /**
     * lists the overdue tasks
     * @return {TodoManager.Task[]}
     */
    overdueTasks() {
      return this.$store.getters.overdueTodos
    },
    anyOverdue() {
      return this.$store.getters.anyOverdue
    }
  },
  methods: {
    /**
     * opens the editor for a specific task
     * @param e {TodoManager.Task} the task to edit
     */
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
  margin-top: 1em;
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
