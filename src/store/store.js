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
            return state.todos.filter((t) => typeof t.dailyPrio === "number")
                .sort((a, b) => calculatePriority(b) - calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
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
