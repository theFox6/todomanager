<template>
  <li>
    <input type="checkbox" v-model="done"/>
    <AutoWidthInput type="text" v-model="title" placeholder="unnamed" />
    <button @click="$emit('editTask', {id: this.id})"><FontAwesomeIcon icon="pen" /></button>
  </li>
</template>

<script>
import AutoWidthInput from "@/components/AutoWidthInput";

export default {
  name: "TaskItem",
  components: {
    AutoWidthInput
  },
  emits: ['editTask'],
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    done: {
      get() {
        return this.$store.getters.getTodoField(this.id, "done")
      },
      set(value) {
        this.$store.commit({
          type: 'updateTask',
          id: this.id,
          done: value
        })
      }
    },
    title: {
      get() {
        return this.$store.getters.getTodoField(this.id, "title")
      },
      set(value) {
        this.$store.commit({
          type: 'updateTask',
          id: this.id,
          title: value
        })
      }
    }
  }
}
</script>

<style scoped>
  li {
    padding: 2pt;
  }
  button {
    text-shadow: 1px 1px black;
    margin-left: 3pt;
    border: none;
    padding-top: 3pt;
    padding-bottom: 3pt;
    background-color: inherit;
  }
</style>