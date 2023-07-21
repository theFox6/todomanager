declare namespace TodoManager {
    interface Task {
        //general fields
        id: number,
        title: string,
        progress: number,
        //priority parameters
        urgency?: number,
        difficulty?: number,
        //days left to fulfill
        bufferDays?: number,
        referenceDate?: number,
        //dailies
        dailyPrio?: number,
        dailyDone?: boolean,
        dailyDate?: number[],
        //archive
        archived?: string
    }
}