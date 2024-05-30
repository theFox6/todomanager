export default {
    /**
     * Creates a function that can evaluate whether a task is scheduled at a future date.
     * @return {(function(TodoManager.Task): boolean)} the filter function
     */
    isScheduledFilter() {
        const today = new Date(Date.now())
        return (task) => {
            if (typeof task.dailyPrio !== "number")
                return false
            const da = task.dailyDate
            if (typeof da !== "object" || da.length !== 3)
                return false
            return new Date(da[2],da[1],da[0]) > today
        }
    },
    /**
     * calculates how many days are left to fulfill the task
     *
     * If a task is scheduled, then it is the amount of days until it's daily date plus its buffer days.
     * If the task is not scheduled, it will be calculated with the date the buffer has been set.
     * If the buffer days are not set, this returns a nullish value.
     * @param task {TodoManager.Task} the task to check the buffer days of
     * @return {number|null} the amount of days left if they were entered
     */
    calculateBufferDays(task) {
        const buf = task[ "bufferDays"]
        let ref = task["referenceDate"]
        if ((!ref) || this.isScheduledFilter()(task)) {
            if (buf) {
                ref = task["dailyDate"]
                // If there is no reference point at all, just return the buffer entry
                if (!ref)
                    return buf
            } else
                return null
        }
        ref = new Date(ref[2], ref[1], ref[0])
        //console.log("to do", id, "has reference date", ref)
        const MS_PER_DAY = 1000 * 60 * 60 * 24
        const date = new Date(Date.now())
        const daysPassed = Math.floor((date - ref) / MS_PER_DAY)
        //console.log("to do", id, "passed", daysPassed, "days")
        if (daysPassed === 0)
            return buf
        return Math.max(buf - daysPassed, 0)
    },
    /**
     * Creates a function that can evaluate whether a task was daily at a past date.
     * @return {(function(TodoManager.Task): boolean)} the filter function
     */
    isOverdueFilter() {
        const today = new Date(Date.now())
        today.setHours(0,0,0,0)
        return (task) => {
            if (task.dailyDone || typeof task.dailyPrio !== "number" || this.calculateBufferDays(task) > 0)
                return false
            const da = task.dailyDate
            if (typeof da !== "object" || da.length !== 3)
                return false
            return new Date(da[2],da[1],da[0]) < today
        }
    },
    /**
     * calculates the priority of the task based on its parameters
     *
     * a more important task gets a greater priority number
     * @param task {TodoManager.Task} the task to be evaluated
     * @return {number} a number representing the tasks priority
     */
    calculatePriority(task) {
        //TODO: estimate time needed based on progress, workload and difficulty
        //      compare it to the time due and let urgency be the deciding factor
        const p = task.progress || 0
        if (p >= 100)
            return -1
        const stats = (task.urgency || 0) + (task.difficulty || 0) + (task.reluctance || 0)
        const buf = this.calculateBufferDays(task)
        const buffFactor = buf ? 1 + 1 / buf : 1
        return stats * buffFactor / (1 + p / 50)
    }
}
