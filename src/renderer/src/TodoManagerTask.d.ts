declare namespace TodoManager {
    /**
     * a To Do-Manager task
     * contains information about task, schedule, progress and difficulty
     */
    interface Task {
        //general fields
        id: number,
        title: string,
        progress: number,
        //priority parameters
        urgency?: number,
        difficulty?: number,
        reluctance?: number,
        //days left to fulfill
        bufferDays?: number,
        referenceDate?: number[],
        //dailies
        dailyPrio?: number,
        dailyDone?: boolean,
        dailyDate?: number[],
        //archive
        archived?: string
    }
}