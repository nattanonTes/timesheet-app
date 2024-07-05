// check timesheet to prevent same day entry, return false when user try to clock in or out twice in a day
const checkTimesheetEntry = (timesheet, mode) => {
    switch (mode) {
        case "start":
            const currentDT = new Date()
            const date = currentDT.getDate()
            break;
    
        default:
            break;
    }
}