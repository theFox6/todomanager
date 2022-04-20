<template>
  <ul>
    <TaskItem v-for="t in todosSorted" :key="t.id" :id="t.id" @editTask="$emit('editTask', $event)"/>
    <li><button class="add-item" @click="addTask">+</button></li>
  </ul>
</template>

<script>
import TaskItem from "@/components/TaskItem";

export default {
  name: "TaskList",
  components: {
    TaskItem
  },
  emits: ["editTask"],
  computed: {
    todosSorted() {
      return this.$store.getters.todosByPriority
    }
  },
  methods: {
    addTask() {
      this.$store.commit('addTask')
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}
.add-item {
  border: ridge #B7B7A4;
  padding: 1pt 1em;
  margin-left: 0.5em;
  font-weight: bold;
  font-size: x-large;
  text-shadow: 1px 1px black;
}
</style>