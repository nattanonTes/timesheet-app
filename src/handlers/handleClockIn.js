import Swal from "sweetalert2";

const handleClockIn = (currentTimeCard) => {
    // variables
    const currentDT = new Date().toISOString();
    const todayDate = currentDT.substring(0,10); 
    const timecardID = currentTimeCard[0]?.$id.value;
    const appID = kintone.app.getId();

    // check if there is current month Timecard, 
    // check clock-in entries on Timesheet 
    let hasThisMonthRecord;
    let hasThisDateEntry = false; 
    if (currentTimeCard.length > 0) {
        hasThisMonthRecord = true
        const currentTs = currentTimeCard[0]?.Timesheet.value;
        for (let i = 0; i < currentTs.length; i++) {
            const thisDate = currentTs[i].value.table_work_start.value.substring(0,10)
            if (thisDate === todayDate) {
                hasThisDateEntry = true
            }
        }
    } else {
        hasThisMonthRecord = false
    }

    // Determine mode 
    let mode; 
    if (hasThisMonthRecord && hasThisDateEntry) {
        mode = "preventEntry"
    } else if (hasThisMonthRecord && hasThisDateEntry === false) {
        mode = "addEntry"
    } else {
        mode = "addTimesheet"
    }
    const day = new Date().getDay()
    let workCategory; 
    if (day === 0 || day === 6) {
        workCategory = 'Weekend'
    } else {
        workCategory = 'Weekday'
    }   

    // Execution for each mode
    switch (mode) {
        // case1: Timecard already created and no today entry yet => record clocking in timestamp. 
        case "addEntry":
        const currentTs = currentTimeCard[0]?.Timesheet.value;
        const timestamp_in = {           
            value: {
                "table_work_start": {
                    "type": "DATETIME",
                    "value": currentDT
                },
                "work_category": {
                    "type": "DROP_DOWN",
                    "value": workCategory
                }
            }
        }
        const newTS = [...currentTs]
        newTS.push(timestamp_in)
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
            // alert('Save success!')
            const localTime = new Date(currentDT).toLocaleTimeString()
            Swal.fire({
                    title: "บันทึกสำเร็จ",
                    text: `บันทึกเวลาเริ่มงาน ${localTime} สำเร็จ`,
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

        // case2: Timecard already created and already clock-in => duplicate start time, prevent timestamp entry.
        case "preventEntry": 
        // alert("Do not allow duplicate input!")
        Swal.fire({
                    title: "บันทึกไม่สำเร็จ",
                    text: `ไม่สามารถบันทึกเวลาได้`,
                    icon: "error"
                });
            break;

        // case3: No Timecard created yet => create Timecard and clock-in with timestamp    
        case "addTimesheet":  
        const bodyTimecard = {
            app : appID,
            record : {
                EmployeeID : {
                    value : '0001'
                },
                Timesheet : {
                    type: "SUBTABLE",
                    value : [{
                        "table_work_start": {
                            "type": "DATETIME",
                            "value": new Date().toISOString()
                        },
                        "work_category": {
                            "type": "DROP_DOWN",
                            "value": workCategory
                        }
                    }]
                }
            }
        }
        kintone.api(kintone.api.url('/k/v1/record.json', true), 'POST', bodyTimecard, function(resp) {
            // success
            const localTime = new Date(currentDT).toLocaleTimeString()
            Swal.fire({
                    title: "บันทึกสำเร็จ",
                    text: `บันทึกเวลาเริ่มงาน ${localTime} สำเร็จ`,
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
            console.log(resp);
          }, function(error) {
            // error
            Swal.fire({
                    title: "บันทึกไม่สำเร็จ",
                    text: `ไม่สามารถบันทึกเวลาได้`,
                    icon: "error"
                });
            console.log(error);
          });
            break; 
        default:
            break;
    }
}

export default handleClockIn;