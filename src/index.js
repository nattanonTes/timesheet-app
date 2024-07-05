import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import getCurrentPeriod from './handlers/getCurrentPeriod';
import handleClockIn from './handlers/handleClockIn';
import handleClockOut from './handlers/handleClockOut';
import calWeekendOT from './handlers/calWeekendOT';


(function () {
  'use strict';

  // Replace with your Custom View's ID
  const customViewID = process.env.CUSTOM_VIEW_ID


  // Increment to confirm script version on Kintone
  const scriptVer = '1.0.3';
  console.log(`\nScript version: ${scriptVer}\n\n`);

  kintone.events.on('app.record.index.show', function (event) {
    if (event.viewId != customViewID) {
      console.log('Not on the Custom View');
      return event 
    }

    function App({event}) {
      const [currentTimecard, setCurrentTimecard] = React.useState([]);
      const [currentTimesheet, setCurrentTimesheet] = React.useState([]); 
      React.useEffect(() => {
        const allRecords = event.records
        const currentPeriod = getCurrentPeriod(); 
        const filteredTimecards = allRecords.filter((i) => i.Period.value === currentPeriod)
        setCurrentTimecard(filteredTimecards)
        // if (filteredTimecards[0].Timesheet.value.length > 0) {
        //   setCurrentTimesheet(filteredTimecards[0].Timesheet.value)
        // }
      },[])

      
    
      return (
        <div className="App">
        <div className="buttonContainer">
        <button className='btn clockIn' onClick={() => handleClockIn(currentTimecard)}>เริ่มงาน</button>
        <button className='btn clockOut' onClick={() => handleClockOut(currentTimecard)}>เลิกงาน</button> 
        </div>
        <div className="timecardContainer">
        <h1 style={{fontWeight:'bold'}}>Timecard ของเดือนนี้  เดือนที่ {getCurrentPeriod() || 'nil'}</h1>
          { currentTimecard?.length > 0 ? currentTimecard?.map((i,idx) => {
            return (
              <div key={idx}>
                  <table className='custom-table'>
                  <tbody>
                    <tr className='custom-tr'>
                      <th className='custom-th'>Date</th>
                      <th className='custom-th'>Start time</th>
                      <th className='custom-th'>End time</th>
                      <th className='custom-th'>Work time</th>
                      <th className='custom-th'>Work category</th>
                      <th className='custom-th'>Overtime</th>
                    </tr>
              { i.Timesheet.value.map((j,jdx) => {
                return (
                    <tr className='custom-tr' key={jdx}>
                      <td className='custom-td' id='date'>{j.value.table_work_start.value.substring(0,10)}</td>
                      <td className='custom-td' id='start_time'>{new Date(j.value.table_work_start.value).toLocaleTimeString()}</td>
                      <td className='custom-td' id='end_time'>{new Date(j.value.table_work_end.value).toLocaleTimeString()}</td>
                      <td className='custom-td' id='work_time'>{j.value.table_work_time.value} hours</td>
                      <td className='custom-td' id='work_category'>{j.value.work_category.value}</td>
                      <td className='custom-td' id='ot'>{j.value.table_ot.value} hours</td>
                    </tr>
                )
              })}
              </tbody>
                </table>
                <div>
                <div style={{marginTop:10}}>
                  Total work hour : {parseInt(currentTimecard[0].total_work_time.value) + ' hours'}
                </div>
                <div>
                  Total weekday OT : {(parseInt(currentTimecard[0].total_ot.value)-calWeekendOT(currentTimecard[0].Timesheet.value)) + ' hours'}
                </div>
                <div>
                  Total weekend OT : {calWeekendOT(currentTimecard[0].Timesheet.value) + ' hours'}
                </div>
                </div>
              </div>
            )
          }) : <div className='not-found'>ไม่พบTimecard</div>}
        </div>
        </div>
      );
    }

    ReactDOM.render(
      <React.StrictMode >
        <App event={event} key={1}/>
      </React.StrictMode>,
      document.getElementById('root')
    );
    return event;
  });
})();