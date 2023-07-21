<template>
  <div class="dialog">
    <p class="close-button" @click="$emit('closeEditor')"><button><font-awesome-icon icon="xmark" /></button></p>
    <p class="title"><AutoWidthInput v-model="title" placeholder="unnamed" /></p>
    <label>progress:<input v-model.number="progress" type="range" min="0" max="100" /><font-awesome-icon :icon="progressIcon" /> {{ progress }}%</label>
    <label>urgency:<input v-model.number="urgency" type="range" min="0" max="100" /><font-awesome-icon :icon="urgencyIcon" /> {{ urgency }}%</label>
    <label>difficulty:<input v-model.number="difficulty" type="range" min="0" max="100" /><font-awesome-icon :icon="difficultyIcon" /> {{ difficulty }}%</label>
    <p class="setting"><label>do today:<input v-model="isDaily" type="checkbox" /></label><label>with priority:<input v-model.number="dailyPrio" type="number" :disabled="!isDaily" /></label></p>
    <p class="setting"><label>days left to fulfill:<input v-model.number="bufferDays" type="number" /></label></p>
    <!--ToDo: add a selection for archiving-->
  </div>
</template>

<script>
import AutoWidthInput from "@/components/AutoWidthInput";
export default {
  name: "TaskEditor",
  components: {AutoWidthInput},
  props: {
    id: {
      type: Number,
      required: true
    },
  },
  emits: ["closeEditor"],
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
    progress: {
      get() {return this.$store.getters.getTodoField(this.id, "progress") || 0},
      set(value) {
        const update = {type: "updateTask", id: this.id, progress: value}
        if (value === 100 && (this.bufferDays ?? -1) >= 0)
          update.bufferDays = null
        this.$store.commit(update)
      }
    },
    urgencyIcon() {
      return this.urgency < 25 ? "hourglass" : this.urgency < 50 ? "person-walking" : this.urgency < 75 ? "person-running" : "fire"
    },
    difficultyIcon() {
      return this.difficulty < 25 ? "apple-whole" : this.difficulty < 50 ? "bag-shopping" : this.difficulty < 75 ? "person-digging" : "mountain"
    },
    progressIcon() {
      return this.progress < 25 ? "clipboard-list" : this.progress < 50 ? "person-digging" : this.progress < 75 ? "hammer" :
          this.progress < 95 ? "screwdriver-wrench" : this.progress < 100 ? "magnifying-glass" : "check"
    },
    dailyPrio: {
      get() {return this.$store.getters.getTodoField(this.id, "dailyPrio")},
      set(value) {this.$store.commit({type: 'updateTask', id: this.id, dailyPrio: value})}
    },
    isDaily: {
      get() {return typeof this.dailyPrio === 'number' || typeof this.dailyPrio === 'string'},
      set(daily) {
        if (daily) {
          this.dailyPrio = 0
          const date = new Date(Date.now())
          this.$store.commit({type: "updateTask", id: this.id, dailyDate: [date.getDate(), date.getMonth(), date.getFullYear()]})
        } else {
          this.dailyPrio = false
        }
      }
    },
    bufferDays: {
      get() {return this.$store.getters.getTodoField(this.id, "bufferDays")},
      set(value) {
        if (typeof value === "number") {
          const date = new Date(Date.now())
          this.$store.commit({
            type: 'updateTask', id: this.id,
            bufferDays: value, referenceDate: [date.getDate(), date.getMonth(), date.getFullYear()]
          })
        } else if (value === "")
          this.$store.commit({type: 'updateTask', id: this.id, bufferDays: null})
        else
          console.info("invalid number of days left:", value)
      }
    }
  }
}
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 5%; left: 5%;
  height: 85%; width: 85%;
  background-color: #DDBEA9;
  padding: 1em;
}
.title {
  text-align: center;
  font-size: large;
}
.setting {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
}
label:not(p > label) {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
}
p > label {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
label > input {
  display: flex;
  align-items: center;
}
input[type="checkbox"] {
  min-width: 1em;
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