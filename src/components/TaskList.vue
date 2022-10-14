<template>
  <ul>
    <TaskItem v-for="t in todos" :key="t.id" :id="t.id" @editTask="$emit('editTask', $event)" :show-daily-prio="showDailyPrio" />
    <li v-if="showAddButton"><button class="add-item" @click="addTask">+</button></li>
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
  props: {
    todos: {
      type: Array,
      required: true
    },
    showDailyPrio: {
      type: Boolean,
      required: false,
      default: false
    },
    showAddButton: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    addTask() {
      this.$store.commit('addTask', {daily: this.showDailyPrio})
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
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