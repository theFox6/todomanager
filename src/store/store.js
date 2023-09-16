import { createStore } from 'vuex'
import NoSuchElementError from "@/NoSuchElementError";

function saveTodos(state) {
    localStorage.setItem('todos', JSON.stringify(state.todos))
}

/**
 * calculates the priority of the task based on its parameters
 *
 * a more important task gets a greater priority number
 * @param task {TodoManager.Task} the task to be evaluated
 * @return {number} a number representing the tasks priority
 */
function calculatePriority(task) {
    //TODO: estimate time needed based on progress, workload and difficulty
    //      compare it to the time due and let urgency be the deciding factor
    const p = task.progress || 0
    if (p >= 100)
        return -1
    const stats = (task.urgency || 0) + (task.difficulty || 0) + (task.reluctance || 0)
    const buffFactor = task.bufferDays ? 1 + 1 / task.bufferDays : 1
    return stats * buffFactor / (1 + p / 50)
}

function isOverdueFilter() {
    const stamp = new Date(Date.now())
    const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
    return (task) => typeof task.dailyPrio === "number" && (!task.dailyDone) &&
        (task.dailyDate && date.some((v,i) => v !== task.dailyDate[i])) //does not account for future dates
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
        /**
         * gets all todos sorted by priority
         * @deprecated use filtering getters instead to exclude archived Todos
         * @param state the state of the store
         * @return {TodoManager.Task[]}
         */
        todosByPriority(state) {
            return state.todos.sort((a, b) => calculatePriority(b) - calculatePriority(a))
        },
        /**
         * gets all tasks that are marked daily
         * @param state the state of the store
         * @return {TodoManager.Task[]}
         */
        dailies(state) {
            const stamp = new Date(Date.now())
            const date = [stamp.getDate(), stamp.getMonth(), stamp.getFullYear()]
            const isDaily = (t) => typeof t.dailyPrio === "number" &&
                ((!t.dailyDate) || date.every((v,i) => v === t.dailyDate[i]))
            //TODO: take daily done into account as well
            return state.todos.filter(isDaily)
                .sort((a, b) => calculatePriority(b) - calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        overdueTodos(state) {
            return state.todos.filter(isOverdueFilter())
                .sort((a, b) => calculatePriority(b) - calculatePriority(a))
                .sort((a, b) => a.dailyPrio - b.dailyPrio)
        },
        backlogTodos(state) {
            return state.todos.filter((task) => !task.archived)
                .sort((a, b) => calculatePriority(b) - calculatePriority(a))
        },
        //TODO: change to todosByArchive
        archivedTodos(state) {
            return state.todos.filter((task) => task.archived)
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
    },
    actions: {
        update(context) {
            const date = new Date(Date.now())
            //console.log("today is", date)
            for (const id of context.getters.todosIDs) {
                if (!id) {
                    console.error("todo without id")
                    continue
                }
                let ref = context.getters.getTodoField(id, "referenceDate")
                if (!ref)
                    continue
                ref = new Date(ref[2], ref[1], ref[0])
                //console.log("to do", id, "has reference date", ref)
                const MS_PER_DAY = 1000 * 60 * 60 * 24
                const daysPassed = Math.floor((date - ref) / MS_PER_DAY)
                //console.log("to do", id, "passed", daysPassed, "days")
                if (daysPassed === 0)
                    continue
                const update = {
                    type: 'updateTask', id: id,
                    referenceDate: [date.getDate(), date.getMonth(), date.getFullYear()]
                }

                const buf = context.getters.getTodoField(id, "bufferDays")
                if (buf > -1)
                    update.bufferDays = Math.max(buf - daysPassed, 0)

                //console.log("commiting update", update)
                context.commit(update)
            }
        }
    }
})
