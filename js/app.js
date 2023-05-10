const employees = JSON.parse(localStorage.getItem("employeesList")) || [];
document.addEventListener("DOMContentLoaded", function() {

    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector('.overlay'); 

    const addEmployee = document.querySelector('.add-employee');
    const name = document.getElementById('name');
    const profession = document.getElementById('profession');
    const email = document.getElementById('email');
    const table = document.getElementById('table');

    /* Hamburger MENU */

    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('close');
        overlay.classList.toggle('show');
    });

    /* SEARCH */

    function searchEmployees(searchTerm) {
        const tableRows = document.querySelectorAll('tbody tr');
      
        tableRows.forEach(row => {
          const name = row.querySelector('.employee-name').textContent.toLowerCase();
          const department = row.querySelector('.employee-proffesion').textContent.toLowerCase();
          const matchesSearch = name.includes(searchTerm) || department.includes(searchTerm);
          row.style.display = matchesSearch ? '' : 'none';
        });
      }

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchEmployees(searchTerm);
    });
    

    /* Table */

    const createRow = (newRowData) => {
        const tr = document.createElement('tr');
        const tdCrt = document.createElement('td');
        const tdName = document.createElement('td');
        const tdProfession = document.createElement('td');
        const tdEmail = document.createElement('td');
        tdName.innerHTML = newRowData.name;
        tdProfession.innerHTML = newRowData.profession;
        tdEmail.innerHTML = newRowData.email;


        tr.setAttribute('data-id', newRowData.id);
        tdCrt.innerHTML = newRowData.id;
        tdCrt.className = "crt";

        console.log("inserdet row", newRowData.id)

        employees.push(newRowData);

        localStorage.setItem("employeesList", JSON.stringify(employees));

        document.querySelector('.popup-add-employee').style.display = 'none';
    }

    function updateRowIndexes() {
        const tableRows = document.querySelectorAll("#tableBody tr");
        tableRows.forEach((row, index) => {
            row.setAttribute("id", `row-${index + 1}`);
            row.setAttribute("data-row-id", index + 1);
        });
      }

    const editRowFct = (rowID) => {

        document.querySelector('.popup-edit-employee').style.display = 'flex';

        let rowsList =  JSON.parse(localStorage.getItem("employeesList"));
        let tableRows = [];
        if(rowsList!==null && rowsList.length > 0)
        {
            tableRows = rowsList;
        }
        let indexRow = 0;
        for(let index = 0; index < tableRows.length; index ++) {
            if(tableRows[index].id!==null && tableRows[index].id === rowID) {
                indexRow = index;
            }
        }

        document.getElementById("name-edit").value = tableRows[indexRow].name;
        document.getElementById('profession-edit').value = tableRows[indexRow].profession;
        document.getElementById('email-edit').value = tableRows[indexRow].email;

        document.getElementById('submit-edited-form').addEventListener('click', () => { 
            const newName = document.getElementById("name-edit").value;
            const newProffesion = document.getElementById('profession-edit').value
            const newEmail = document.getElementById('email-edit').value;

            tableRows[indexRow].name = newName;
            tableRows[indexRow].profession = newProffesion;
            tableRows[indexRow].email = newEmail;

            localStorage.setItem('employeesList', JSON.stringify(tableRows));
            location.reload();
        })
        document.querySelector('.close-popup-edit').addEventListener('click', () => {
        document.querySelector('.popup-edit-employee').style.display = 'none';
        });
            
    }

    const deleteRowFct = (rowID) => {
        document.querySelector('.popup-delete-employee').style.display = 'flex';

        let currentRowData = JSON.parse(localStorage.getItem("employeesList")) || [];
        const rowIndex = currentRowData.findIndex(row => row.id === rowID);
        const name = currentRowData[rowIndex].name;
        const ptext = document.querySelector('.delete-employee-paragraph');
        ptext.innerHTML = '';
        ptext.innerHTML = "Are you sure you want to delete " + name + " from the table?";

        document.querySelector('.close-popup-delete').addEventListener('click', () => {
            document.querySelector('.popup-delete-employee').style.display = 'none';
        });
        document.querySelector('.cancel-emp-btn').addEventListener('click', () => {
            document.querySelector('.popup-delete-employee').style.display = 'none';
        });

        let deletedrowtrue = 0;
        document.querySelector('.delete-emp-btn').addEventListener('click', () => {

            const updatedTableData = currentRowData.filter(data => data.id !== parseInt(rowID));

            currentRowData.splice(rowIndex, 1);

            localStorage.setItem('employeesList', JSON.stringify(updatedTableData));

            updateRowIndexes();

            const rowToDelete = document.querySelector(`#row-${rowID}`);
        
            document.querySelector('.popup-delete-employee').style.display = 'none';
            location.reload();
        });

        displayRows(currentRowData);

    }

    // add employee

    addEmployee.addEventListener('click', () => {
        document.querySelector('.popup-add-employee').style.display = 'flex';
    });
    
    document.querySelector('.close-popup-add').addEventListener('click', () => {
        document.querySelector('.popup-add-employee').style.display = 'none';
    });
    

    // display rows
    const displayRows = (rows) =>{ 
        let tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        const tdEdit = document.createElement('td');
        const tdDelete = document.createElement('td');
        tdEdit.innerHTML = "<i class='bx bxs-edit'></i>";
        tdEdit.className = "popup-edit-row";
        tdDelete.innerHTML = "<i class='bx bx-x'></i>";
        tdDelete.className = "popup-delete-row";

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
        
            let newRow = document.createElement("tr");

            newRow.setAttribute('data-id', row.id);
        
            newRow.innerHTML = `
              <td>${row.id}</td>
              <td><a class="employee-name employee-link" href="pointing.html" data-name="${row.name}">${row.name}</a></td>
              <td class="employee-proffesion">${row.profession}</td>
              <td>${row.email}</td>
              <td>${tdEdit.innerHTML}</td>
              <td>${tdDelete.innerHTML}</td>
            `;
        
            const editBtn = newRow.querySelector(".bxs-edit");
            const deleteBtn = newRow.querySelector(".bx-x");
        
            editBtn.addEventListener("click", () => {
                editRowFct(row.id);
            });
            deleteBtn.addEventListener('click', () => {
                deleteRowFct(row.id);
            });
        
            tableBody.appendChild(newRow);
          }
    }

    /* Submit FORM */

    document.querySelector('.submit-employee').addEventListener('click', (e) => {
        e.preventDefault();
        let rowsList =  JSON.parse(localStorage.getItem("employeesList"));
        let tableRows = [];
        if(rowsList!==null && rowsList.length > 0)
        {
            tableRows = rowsList;
        }

        let maxId = 1;
        
        for(let index = 0; index < tableRows.length; index ++) {
            if(tableRows[index].id!==null && tableRows[index].id > maxId) {
                maxId = tableRows[index].id;
            }
        }
        
        const newRowData = {
            id: maxId + 1,
            name: name.value,
            profession: profession.value,
            email: email.value
        };
        createRow(newRowData);


        let rowData = JSON.parse(localStorage.getItem("employeesList")) || [];
        displayRows(rowData);

    });
    
    let rowData = JSON.parse(localStorage.getItem("employeesList")) || [];
    displayRows(rowData);

    const employeeLinks = document.querySelectorAll('.employee-link');

    employeeLinks.forEach(link => {
        link.addEventListener('click', event => {
        event.preventDefault(); 

        const employeeName = link.getAttribute('data-name');
        console.log(employeeName);

        window.location.href = `pointing.html?name=${encodeURIComponent(employeeName)}`;
        });
    });

});
