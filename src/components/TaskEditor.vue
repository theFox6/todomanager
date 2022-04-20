<template>
  <div class="dialog">
    <p class="close-button" @click="$emit('closeEditor')"><button><font-awesome-icon icon="xmark" /></button></p>
    <p class="title"><AutoWidthInput v-model="title" placeholder="unnamed" /></p>
    <label>urgency:<input type="range" v-model.number="urgency" min="0" max="100" /><font-awesome-icon :icon="urgencyIcon" /> {{urgency}}%</label>
    <label>difficulty:<input type="range" v-model.number="difficulty" min="0" max="100" /><font-awesome-icon :icon="difficultyIcon" /> {{difficulty}}%</label>
  </div>
</template>

<script>
import AutoWidthInput from "@/components/AutoWidthInput";
export default {
  name: "TaskEditor",
  components: {AutoWidthInput},
  emits: ["closeEditor"],
  props: {
    id: Number
  },
  computed: {
    title: {
      get() {
        return this.$store.getters.getTodoField(this.id, 'title')
      },
      set(value) {
        this.$store.commit({
          type: 'updateTask',
          id: this.id,
          title: value
        })
      }
    },
    urgency: {
      get() {return this.$store.getters.getTodoField(this.id, "urgency") || 0},
      set(value) {this.$store.commit({type: 'updateTask', id: this.id, urgency: value})}
    },
    difficulty: {
      get() {return this.$store.getters.getTodoField(this.id, "difficulty") || 0},
      set(value) {this.$store.commit({type: 'updateTask', id: this.id, difficulty: value})}
    },
    urgencyIcon() {
      return this.urgency < 25 ? "hourglass" : this.urgency < 50 ? "person-walking" : this.urgency < 75 ? "person-running" : "fire"
    },
    difficultyIcon() {
      return this.difficulty < 25 ? "apple-whole" : this.difficulty < 50 ? "bag-shopping" : this.difficulty < 75 ? "person-digging" : "mountain"
    }
  }
}
</script>

<style scoped>
.dialog {
  position: absolute;
  top: 5%; left: 5%;
  height: 85%; width: 85%;
  background-color: #DDBEA9;
  padding: 1em;
}
.title {
  text-align: center;
  font-size: large;
}
label {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
}
label > input {
  display: flex;
  align-items: center;
}
.close-button {
  text-align: right;
  margin-top: 0;
}
.close-button > button {
  border: ridge #CB997E;
  padding: 3pt 6pt;
}
input {
  width: 60%;
}
</style>