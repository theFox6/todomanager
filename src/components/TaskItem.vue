<template>
  <li>
    <span v-if="showDailyPrio" style="display: inline-flex">
      <input v-model.number.lazy="dailyPrio" type="number" class="daily-prio" />
      <span class="small-buttons" style="display: inline-grid">
        <button title="list earlier" @click="dailyPrio--">&#9650;</button>
        <button title="list later" @click="dailyPrio++">&#9660;</button>
      </span>
    </span>
    <input v-if="showDailyPrio" v-model="done" type="checkbox" title="done for today" />
    <!--perhaps show the icon of the highest stat (urgency, difficulty, fear) or only the urgency icon-->
    <!--TODO: maybe show the pen for editing when hovering over the progress circle-->
    <ProgressCircle :percent="progress" style="margin-left: 3pt; margin-right: 1pt" :status-color="statusColor" />
    <AutoWidthInput v-model="title" type="text" placeholder="unnamed" />
    <button v-if="!showDailyPrio && progress < 100" title="finish" @click="progress = 100"><FontAwesomeIcon icon="check" /></button>
    <button v-else-if="progress >= 100" title="delete" @click="deleteTask"><FontAwesomeIcon icon="trash" /></button>
    <button title="edit" @click="$emit('editTask', {id: id})"><FontAwesomeIcon icon="pen" /></button>
    <button :title="isDaily ? 'remove from dailies' : 'add to dailies'" @click="isDaily = !isDaily"><font-awesome-icon :icon="isDaily ? 'calendar-xmark' : 'calendar-plus'" /></button>
    <button :title="archive ? 'retrieve' : 'archive'" @click="archive ? (archive = false) : (archive = 'default')"><font-awesome-icon :icon="archive ? 'arrow-up' : 'archive'" /></button>
  </li>
</template>

<script>
import AutoWidthInput from "@/components/AutoWidthInput";
import ProgressCircle from "@/components/ProgressCircle";

export default {
  name: "TaskItem",
  components: {
    ProgressCircle,
    AutoWidthInput
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    showDailyPrio: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['editTask'],
  computed: {
    done: {
      get() {
        return this.$store.getters.getTodoField(this.id, "dailyDone")
      },
      set(value) {
        const data = {
          type: 'updateTask',
          id: this.id,
          dailyDone: value
        }
        const stamp = new Date(Date.now())
        const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
        const due = this.$store.getters.getTodoField(this.id, "dailyDate")
        if (due && date.some((v,i) => v !== due[i])) {
          data.dailyDate = false
          data.dailyPrio = false
        }
        this.$store.commit(data)
      }
    },
    dailyPrio: {
      get() {return this.$store.getters.getTodoField(this.id, "dailyPrio")},
      set(value) {this.$store.commit({type: 'updateTask', id: this.id, dailyPrio: value})}
    },
    dailyDate: {
      get() {return this.$store.getters.getTodoField(this.id, "dailyDate")},
      set(value) {this.$store.commit({type: "updateTask", id: this.id, dailyDate: value})}
    },
    progress: {
      get() {return this.$store.getters.getTodoField(this.id, "progress")},
      set(value) {
        const update = {type: "updateTask", id: this.id, progress: value}
        if (value === 100 && this.statusColor)
          update.bufferDays = null
        this.$store.commit(update)
      }
    },
    isDaily: {
      get() {
        const stamp = new Date(Date.now())
        const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
        return (typeof this.dailyPrio === 'number' || typeof this.dailyPrio === 'string')
            && (!this.dailyDate || date.every((v,i) => v === this.dailyDate[i])) //doesn't account for future dates
      },
      set(daily) {
        if (daily) {
          this.dailyPrio = 0
          const date = new Date(Date.now())
          this.dailyDate = [date.getDate(), date.getMonth(), date.getFullYear()]
          this.done = false
        } else {
          this.dailyPrio = false
          //perhaps add a setting whether this should happen when the task is done or daily done
          if (this.statusColor)
            this.$store.commit({type: 'updateTask', id: this.id, bufferDays: null})
        }
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
    },
    archive: {
      get() {
        return this.$store.getters.getTodoField(this.id, "archived")
      },
      set(value) {
        this.$store.commit({
          type: 'updateTask',
          id: this.id,
          archived: value
        })
      }
    },
    statusColor: {
      get() {
        const buffer = this.$store.getters.getTodoField(this.id, "bufferDays") ?? -1
        return buffer < 0 ? undefined :
            buffer === 0 ? "black" : //magenta would work too
            buffer === 1 ? "red" :
            buffer === 2 ? "gold" :
            buffer === 3 ? "limegreen" :
            "#0089ff"
      }
    }
  },
  methods: {
    deleteTask() {
      this.$store.commit("deleteTask", this.id)
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
  margin-left: 1pt;
  margin-right: 1pt;
  border: none;
  padding-top: 3pt;
  padding-bottom: 3pt;
  background-color: inherit;
}
.daily-prio {
  width: 1.2em;
  font-size: medium;
  text-align: center;
  background: none;
  border: none;
}
.daily-prio:focus, .daily-prio:hover {
  outline: none;
  border-bottom: 2px solid;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.small-buttons > button {
  padding: 0;
  margin: 0;
}
</style>