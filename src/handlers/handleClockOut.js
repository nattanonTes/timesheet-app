import Swal from "sweetalert2";

const handleClockOut = (currentTimeCard) => {
    console.log('clockOut');
    // variables
    const currentDT = new Date().toISOString();
    const todayDate = currentDT.substring(0,10); 
    const timecardID = currentTimeCard[0]?.$id.value;
    const appID = kintone.app.getId();

    // check if there is current month Timecard, 
    // check clock-in entries on Timesheet 
    let hasThisMonthRecord;
    let hasThisDateEntry = false; 
    let hasThisDateClockOut = false
    let thisDateEntryIndex; 
    if (currentTimeCard.length > 0) {
        hasThisMonthRecord = true
        const currentTs = currentTimeCard[0]?.Timesheet.value;
        for (let i = 0; i < currentTs.length; i++) {
            const thisDateCLockIn = currentTs[i].value.table_work_start.value.substring(0,10)
            const thisDateClockOut = currentTs[i].value.table_work_end.value.substring(0,10)
            if (thisDateCLockIn === todayDate) {
                hasThisDateEntry = true
                thisDateEntryIndex = i
            }
            if (thisDateClockOut === todayDate) {
                hasThisDateClockOut = true
            }
        }
    } else {
        hasThisMonthRecord = false
    }

    // Determine mode 
    let mode; 
    if (hasThisMonthRecord && hasThisDateEntry && hasThisDateClockOut === false) {
        mode = "addEntry"
    } else {
        mode = "preventEntry"
    } 

    // Execution for each mode
    switch (mode) {
        // case1: Timecard already created and already clocked-in => record clocking out with timestamp. 
        case "addEntry":
        const currentTs = currentTimeCard[0]?.Timesheet.value;    
        const newTS = [...currentTs]
        newTS[thisDateEntryIndex].value.table_work_end = { "type": "DATETIME", "value": currentDT }
        const bodyTimestamp = {
            app : appID,
            id : timecardID, 
            record : {
                Timesheet: {
                    value : newTS
                }
            }
        }
        kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', bodyTimestamp, function(resp) {
            const localTime = new Date(currentDT).toLocaleTimeString()
            Swal.fire({
                    title: "บันทึกสำเร็จ",
                    text: `บันทึกเวลาเลิกงาน ${localTime} สำเร็จ`,
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
            console.log(resp);
          }, function(error) {
            alert('Something went wrong!')
            console.log(error);
          });
            break;

        // case2: Timecard already created but no clock-in yet or already clocked-out => duplicate end time, prevent timestamp entry.
        case "preventEntry": 
        Swal.fire({
                    title: "บันทึกไม่สำเร็จ",
                    text: `ไม่สามารถบันทึกเวลาได้`,
                    icon: "error"
                });
            break;
        default:
            break;
    }

}

export default handleClockOut; 