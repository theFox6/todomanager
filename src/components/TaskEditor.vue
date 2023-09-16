<template>
  <div class="dialog">
    <p class="title"><span /><AutoWidthInput v-model="title" placeholder="unnamed" class="push-down" /><button @click="$emit('closeEditor')"><font-awesome-icon icon="xmark" /></button></p>
    <table class="parameter-table">
      <tr><td>progress:</td><td><input v-model.number="progress" type="range" min="0" max="100" /></td><td><font-awesome-icon :icon="progressIcon" /></td><td>{{ progress }}%</td></tr>
      <tr><td>urgency:</td><td><input v-model.number="urgency" type="range" min="0" max="100" /></td><td><font-awesome-icon :icon="urgencyIcon" /></td><td>{{ urgency }}%</td></tr>
      <tr><td>difficulty:</td><td><input v-model.number="difficulty" type="range" min="0" max="100" /></td><td><font-awesome-icon :icon="difficultyIcon" /></td><td>{{ difficulty }}%</td></tr>
      <tr><td>reluctance:</td><td><input v-model.number="reluctance" type="range" min="0" max="100" /></td><td><font-awesome-icon :icon="reluctanceIcon" /></td><td>{{ reluctance }}%</td></tr>
    </table>
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
    reluctance: {
      get() {return this.$store.getters.getTodoField(this.id, "reluctance") || 0},
      set(value) {this.$store.commit({type: 'updateTask', id: this.id, reluctance: value})}
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
    reluctanceIcon() {
      return this.reluctance < 20 ? "face-laugh-wink" : this.reluctance < 40 ? "face-smile" :
          this.reluctance < 60 ? "face-meh" : this.reluctance < 80 ? "face-grimace" : "face-tired";
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
button {
  border: ridge #CB997E;
  padding: 3pt 6pt;
  height: fit-content;
}

.dialog {
  position: fixed;
  top: 5%; left: 5%;
  height: 85%; width: 85%;
  background-color: #DDBEA9;
  padding-left: 1em;
  padding-right: 1em;
}
.title {
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-size: large;
  min-height: min-content;
  height: 3rem;
}
.setting {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
}
.push-down {
  margin-top: auto;
}

label:not(p > label) {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
}
p > label {
  display: flex;
  width: 100%;
  & input {
    margin-left: 1em;
    margin-right: 1em;
  }
}

.parameter-table {
  width: 100%;
  & td {
    padding-left: 1em;
    padding-right: 1em;
  }
  & input {
    width: 100%;
  }
  & td:has(input) {
    width: 100%;
  }
}
</style>
