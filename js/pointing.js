document.addEventListener("DOMContentLoaded", function() {

  // menu
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector('.overlay');
  hamburger.addEventListener('click', function() {
    sidebar.classList.toggle('close');
    overlay.classList.toggle('show');
  });

  // employee name
  const urlParams = new URLSearchParams(window.location.search);
  const employeeName = urlParams.get('name');
  document.getElementById('employee-name-title').textContent = employeeName;

  const monthInput = document.getElementById('month-input');
  const changeDateButton = document.getElementById('change-date-button');

  // FUNCTIONS 

  function calculateTotalTime(inTime, outTime) {
    const inDate = new Date(`2000-01-01 ${inTime}`);
    const outDate = new Date(`2000-01-01 ${outTime}`);
  
    if (outDate < inDate) {
      outDate.setDate(outDate.getDate() + 1);
    }
  
    const diffMs = outDate - inDate;
    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMins = Math.floor((diffMs / 1000 / 60) % 60);
  
    return `${diffHrs}:${diffMins.toString().padStart(2, '0')}`;
  }

  function addOrEditRow(employeeIdentifier, month, date, rowData) {
    const localStorageKey = `employee_${employeeIdentifier}`;
    
    const existingData = getDataFromLocalStorage(employeeIdentifier) || {};
    
    const monthData = existingData[month] || {};
    
    monthData[date] = rowData;
    
    existingData[month] = monthData;
    
    saveDataToLocalStorage(localStorageKey, existingData);
  }
  
  function saveDataToLocalStorage(localStorageKey, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(localStorageKey, jsonData);
  }
  
  function getDataFromLocalStorage(localStorageKey) {
    const jsonData = localStorage.getItem(localStorageKey);
    return JSON.parse(jsonData);
  }

    //calculate actual time

    const calculateTotalTimeForRow = (row) => {
      console.log(row)
      const totalTimeAMCell = row.querySelector('.totalTimeAM');
      const totalTimePMCell = row.querySelector('.totalTimePM');
    
      const totalTimeAM = totalTimeAMCell.textContent.trim() || '0:00';
      const totalTimePM = totalTimePMCell.textContent.trim() || '0:00';
    
      const [hoursAM, minutesAM] = totalTimeAM.split(':').map(Number);
      const [hoursPM, minutesPM] = totalTimePM.split(':').map(Number);
    
      let totalHours = hoursAM + hoursPM;
      let totalMinutes = minutesAM + minutesPM;
    
      if (totalMinutes >= 60) {
        totalMinutes -= 60;
        totalHours += 1;
      }
    
      return `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
    };

    // lunch time

    const calculateTimeForLunch = (row) => {
      const outAM = row.querySelector('.outTimeAM');
      const inPM = row.querySelector('.inTimePM');
    
      const totalTimeAM = outAM.textContent.trim() || '0:00';
      const totalTimePM = inPM.textContent.trim() || '0:00';
    
      const [hoursAM, minutesAM] = totalTimeAM.split(':').map(Number);
      const [hoursPM, minutesPM] = totalTimePM.split(':').map(Number);
    
      const totalHours = hoursPM - hoursAM;
      let totalMinutes = minutesPM - minutesAM;
    
      if (totalMinutes >= 60) {
        totalMinutes -= 60;
        totalHours += 1;
      }
    
      return `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
    };

    // total month time

    const calculateTotalSum = () => {
      const tableBody = document.getElementById('pointing-table-body');
      const columnIdx = 10;
    
      let totalTime = 0;
    
      const rows = tableBody.getElementsByTagName('tr');
    
      for (let i = 0; i < rows.length - 1; i++) {
        const cell = rows[i].cells[columnIdx];
    
        if (cell.textContent) {
          const time = cell.textContent;
    
          const [hours, minutes] = time.split(':').map(Number);
          totalTime += hours * 60 + minutes;
        }
      }
    
      const totalHours = Math.floor(totalTime / 60);
      const totalMinutes = totalTime % 60;
      const formattedTotalTime = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
    
      return formattedTotalTime;
    };

    changeDateButton.addEventListener('click', event => {
        const selectedMonth = monthInput.value;

        const dateObj = new Date(selectedMonth + '-01');
        const monthName = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear();
        const formattedDate = `${monthName} ${year}`;
        document.getElementById('month-year').innerHTML = formattedDate;

        const daysInMonth = new Date(year, dateObj.getMonth() + 1, 0).getDate();
        const tableBody = document.getElementById('pointing-table-body');

        tableBody.innerHTML = '';

        for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, dateObj.getMonth(), day);
        const weekday = currentDate.toLocaleDateString('default', { weekday: 'long' });
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${weekday}</td>
            <td>${monthName} ${day}</td>
            <td class="editable inTimeAM"></td>
            <td class="editable outTimeAM"></td>
            <td class="totalTimeAM"></td>
            <td class="lunch"></td>
            <td class="editable inTimePM"></td>
            <td class="editable outTimePM"></td>
            <td class="totalTimePM"></td>
            <td class="editable extrabreak"></td>
            <td class="actualTime"></td>
            <td class="editable holiday"></td>
        `;
        
        tableBody.appendChild(newRow);
        }
    });

    const tableBody = document.getElementById('pointing-table-body');
    tableBody.addEventListener('dblclick', (event) => {
        const cell = event.target;
        const cellValue = cell.textContent;
        const row = cell.parentNode;
        
        if (cell.classList.contains('editable')) {
          const input = document.createElement('input');
          input.type = 'text';
          input.value = cellValue;
          input.className = "inputEdit";
          input.style = ` box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 0.5rem;
          border: none;
          text-align: center;`;
      
          cell.textContent = '';
          cell.appendChild(input);
          input.focus();
      
          input.addEventListener('blur', function() {
            const newValue = input.value;
      
            cell.textContent = newValue;
            row.classList.remove('editing');

            if (cell.classList.contains('inTimeAM') || cell.classList.contains('outTimeAM')) {
              const inTimeCell = row.querySelector('.inTimeAM');
              const outTimeCell = row.querySelector('.outTimeAM');
              const totalTimeCell = row.querySelector('.totalTimeAM');
              const inTime = inTimeCell.textContent;
              const outTime = outTimeCell.textContent;
              if (inTime && outTime) {
                const totalTime = calculateTotalTime(inTime, outTime);
                totalTimeCell.textContent = totalTime;
              }
            }
            if (cell.classList.contains('inTimePM') || cell.classList.contains('outTimePM')) {
              const inTimeCell = row.querySelector('.inTimePM');
              const outTimeCell = row.querySelector('.outTimePM');
              const totalTimeCell = row.querySelector('.totalTimePM');
              const inTime = inTimeCell.textContent;
              const outTime = outTimeCell.textContent;
              if (inTime && outTime) {
                const totalTime = calculateTotalTime(inTime, outTime);
                totalTimeCell.textContent = totalTime;
              }
            }

            //lunch time       
            if(row.querySelector('.outTimeAM').textContent!=='' && row.querySelector('.inTimePM').textContent!=='') {
              const lunchTime = row.querySelector('.lunch');
              lunchTime.textContent = calculateTimeForLunch(row);
            }            
            
            //actual time
            if(row.querySelector('.totalTimeAM').innerHTML!=='' && row.querySelector('.totalTimePM').innerHTML!=='') {
              const actualTime = row.querySelector('.actualTime');
              actualTime.textContent = calculateTotalTimeForRow(row);

              const totalTimeMont = document.getElementById('total-time');
              totalTimeMont.textContent = "Total: " + calculateTotalSum();
            }
            
          });
          row.classList.add('editing');
          
        }
    });
    

    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = currentDate.getFullYear().toString();
    const currentMonthYear = `${currentYear}-${currentMonth}`;
    monthInput.value = currentMonthYear;

    changeDateButton.click();


});


