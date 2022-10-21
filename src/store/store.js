import { createStore } from 'vuex'
import NoSuchElementError from "@/NoSuchElementError";

function saveTodos(state) {
    localStorage.setItem('todos', JSON.stringify(state.todos))
}

function calculatePriority(task) {
    if (task.done)
        return -1
    return (task.urgency || 0) + (task.difficulty || 0)
}

function isOverdueFilter() {
    const stamp = new Date(Date.now())
    const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
    return (task) => typeof task.dailyPrio === "number" && (!task.done) &&
        (task.dailyDate && date.some((v,i) => v !== task.dailyDate[i])) //does not account for future dates
}

export default createStore({
    state() {
        return {
            todos: []
        }
    },
    getters: {
        todosCount(state) {
            return state.todos.length
        },
        getTodoField: (state) => (id, fieldName) => {
            const item = state.todos.find((t) => t.id === id)
            if (item)
                return item[fieldName]
            return undefined
        },
        todosByPriority(state) {
            return state.todos.sort((a, b) => calculatePriority(b) - calculatePriority(a))
        },
        dailies(state) {
            const stamp = new Date(Date.now())
            const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
            const isDaily = (t) => typeof t.dailyPrio === "number" &&
                ((!t.dailyDate) || date.every((v,i) => v === t.dailyDate[i]))
            return state.todos.filter(isDaily)
                .sort((a, b) => calculatePriority(b) - calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        overdueTodos(state) {
            return state.todos.filter(isOverdueFilter())
                .sort((a, b) => calculatePriority(b) - calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        anyOverdue(state) {
            return state.todos.some(isOverdueFilter())
        }
    },
    mutations: {
        initialize(state) {
            if (localStorage.getItem('todos')) {
                try {
                    state.todos = JSON.parse(localStorage.getItem('todos'))
                } catch (e) {
                    console.warn("loading todos failed")
                    console.warn(e)
                }
            } else
                console.info("no todos found in storage")
        },
        addTask(state, payload) {
            const id = parseInt(localStorage.getItem('nextId') || "1")
            const task = {id: id, title: '', done: false}
            if (payload.daily)
                task.dailyPrio = 0
            state.todos.push(task)
            localStorage.setItem('nextId', "" + (id + 1))
            //saveTodos(state)
        },
        updateTask(state, payload) {
            const item = state.todos.find((t) => t.id === payload.id)
            if (!item)
                throw new NoSuchElementError("No todo with id " + payload.id)
            for (const i in payload) {
                if (i !== "id" && i !== "type")
                    item[i] = payload[i]
            }
            saveTodos(state)
        },
        deleteTask(state, id) {
            state.todos = state.todos.filter((t) => t.id !== id);
        }
    }
})
