import { createStore } from 'vuex'
import NoSuchElementError from "@renderer/NoSuchElementError";
import TodoProperties from "@renderer/store/TodoProperties";

function saveTodos(state) {
    localStorage.setItem('todos', JSON.stringify(state.todos))
}

export default createStore({
    /**
     * creates the initial state of the store
     * @return {{todos: TodoManager.Task[]}}
     */
    state() {
        return {
            todos: []
        }
    },
    getters: {
        dataString(state) {
            return JSON.stringify(state.todos)
        },
        todosCount(state) {
            return state.todos.length
        },
        /**
         * returns an array containing the IDs of all Todos
         * @param state the state of the store
         * @return {number[]}
         */
        todosIDs(state) {
          return state.todos.map((t) => t.id)
        },
        getTodoField: (state) => (id, fieldName) => {
            const item = state.todos.find((t) => t.id === id)
            if (item)
                return item[fieldName]
            return undefined
        },
        getDaysLeft: (state) => (id) => {
            return TodoProperties.calculateBufferDays(state.todos.find((t) => t.id === id))
        },
        /**
         * gets all todos sorted by priority
         * @deprecated use filtering getters instead to exclude archived Todos
         * @param state the state of the store
         * @return {TodoManager.Task[]}
         */
        todosByPriority(state) {
            return state.todos.sort((a, b) => TodoProperties.calculatePriority(b) - TodoProperties.calculatePriority(a))
        },
        /**
         * gets all tasks that are marked daily
         * @param state the state of the store
         * @return {TodoManager.Task[]}
         */
        dailies(state) {
            const today = new Date(Date.now())
            today.setHours(0,0,0,0)
            const isDaily = (t) => {
                if (typeof t.dailyPrio !== "number")
                    return false
                const da = t.dailyDate
                if (typeof da !== "object" || da.length !== 3)
                    return true
                const dd = new Date(da[2],da[1],da[0])
                if (dd > today)
                    return false
                return TodoProperties.calculateBufferDays(t) > 0 || !(dd < today)
            }
            //perhaps take daily done into account as well if dailyPrio is equal
            return state.todos.filter(isDaily)
                .sort((a, b) => TodoProperties.calculatePriority(b) - TodoProperties.calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        overdueTodos(state) {
            return state.todos.filter(TodoProperties.isOverdueFilter())
                .sort((a, b) => TodoProperties.calculatePriority(b) - TodoProperties.calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        scheduledTodos(state) {
            return state.todos.filter(TodoProperties.isScheduledFilter())
                .sort((a, b) => TodoProperties.calculatePriority(b) - TodoProperties.calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        backlogTodos(state) {
            return state.todos.filter((task) => !task.archived)
                .sort((a, b) => TodoProperties.calculatePriority(b) - TodoProperties.calculatePriority(a))
        },
        //TODO: change to todosByArchive
        archivedTodos(state) {
            return state.todos.filter((task) => task.archived)
        },
        anyOverdue(state) {
            return state.todos.some(TodoProperties.isOverdueFilter())
        },
        anyScheduled(state) {
            return state.todos.some(TodoProperties.isScheduledFilter())
        },
        isScheduled: (state) => (id) => {
            const item = state.todos.find((t) => t.id === id)
            if (item)
                return TodoProperties.isScheduledFilter()(item)
            return false
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
            const task = {id: id, title: '', progress: 0}
            if (payload.daily) {
                task.dailyPrio = 0
                task.dailyDone = false
            }
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
