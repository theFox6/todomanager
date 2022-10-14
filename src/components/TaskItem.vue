<template>
  <li>
    <span v-if="showDailyPrio" style="display: inline-flex">
      <input type="number" v-model.number.lazy="dailyPrio" class="daily-prio" />
      <span class="small-buttons" style="display: inline-grid">
        <button @click="dailyPrio--">&#9650;</button>
        <button @click="dailyPrio++">&#9660;</button>
      </span>
    </span>
    <input type="checkbox" v-model="done"/>
    <AutoWidthInput type="text" v-model="title" placeholder="unnamed" />
    <button @click="$emit('editTask', {id: this.id})"><FontAwesomeIcon icon="pen" /></button>
    <button><font-awesome-icon :icon="isDaily ? 'calendar-xmark' : 'calendar-plus'" @click="isDaily = !isDaily" /></button>
    <button v-if="done" @click="deleteTask"><FontAwesomeIcon icon="trash" /></button>
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
    },
    showDailyPrio: {
      type: Boolean,
      required: false,
      default: false
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
    dailyPrio: {
      get() {return this.$store.getters.getTodoField(this.id, "dailyPrio")},
      set(value) {this.$store.commit({type: 'updateTask', id: this.id, dailyPrio: value})}
    },
    dailyDate: {
      get() {return this.$store.getters.getTodoField(this.id, "dailyDate")},
      set(value) {this.$store.commit({type: "updateTask", id: this.id, dailyDate: value})}
    },
    isDaily: {
      get() {
        const stamp = new Date(Date.now())
        const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
        return (typeof this.dailyPrio === 'number' || typeof this.dailyPrio === 'string')
            && (!this.dailyDate || date.every((v,i) => v !== this.dailyDate[i])) //doesn't account for future dates
      },
      set(daily) {
        if (daily) {
          this.dailyPrio = 0
          const date = new Date(Date.now())
          this.dailyDate = [date.getDate(), date.getMonth(), date.getFullYear()]
        } else
          this.dailyPrio = false
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
  margin-left: 3pt;
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