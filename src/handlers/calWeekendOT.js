const calWeekendOT = (timesheet) => {  
     const weekendOT = timesheet.reduce((acc,curr) => {  
        const workCategory = curr.value.work_category.value
             if (workCategory == 'Weekend') {
                  const num = parseInt(curr.value.table_ot.value)  
                  acc += num 
             }
             return acc
     },0)
     return weekendOT
}

export default calWeekendOT

