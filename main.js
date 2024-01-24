function getFullName(student) { //создаем функцию которая из объекта student возвращем ФИО и удаляя лишние пробелы 
    return student.surename.trim() + ' ' + student.name.trim() + ' ' + student.middlename.trim()
}

function getStudyPeriod(student) {
    const currentYear = new Date().getFullYear();
    const graduationYear = student.startStudy + 4;
    const course = currentYear - student.startStudy + 1;

    if (currentYear > graduationYear) {
        return `${student.startStudy}-${graduationYear} (закончил обучение)`;
    } else {
        return `${student.startStudy}-${graduationYear} (${course} курс)`;
    }
}

function getBirthDate(student) {


    const yyyy = student.birthDate.getFullYear();
    let mm = student.birthDate.getMonth() + 1;
    let dd = student.birthDate.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '.' + mm + '.' + yyyy;
}

function getAge(student) {
    const today = new Date();
    let age = today.getFullYear() - student.birthDate.getFullYear();
    let m = today.getMonth() - student.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < student.birthDate.getDate())) {
        age--;
    }
    return age;
}

function addStudentInTable(student) {
    let tbody = document.getElementById('tbody')
    let tr = document.createElement('tr');

    let tdFullName = document.createElement('td');
    tdFullName.textContent = getFullName(student);

    let tdFaculty = document.createElement('td');
    tdFaculty.textContent = student.faculty;

    let tdBirthAge = document.createElement('td');
    let age = getAge(student)
    tdBirthAge.textContent = getBirthDate(student) + ' (' + age + ' лет)';

    let tdStudyPeriod = document.createElement('td');
    tdStudyPeriod.textContent = getStudyPeriod(student);

    tr.appendChild(tdFullName);
    tr.appendChild(tdFaculty);
    tr.appendChild(tdBirthAge);
    tr.appendChild(tdStudyPeriod);

    tbody.appendChild(tr);
}

const yearOfAdmissionInput = document.getElementById('year-of-admission');
yearOfAdmissionInput.addEventListener('input', function () {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
});


const BirthDatyValue = document.getElementById('year-of-birth');
BirthDatyValue.addEventListener('input', function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

let arrayStudents = []

const form = document.getElementById('students-list');
form.addEventListener('submit', function (event) {
    event.preventDefault()
    if (!validation(form)) {
        return;
    }
    let studentName = document.getElementById('name').value;
    let studentSurename = document.getElementById('surname').value;
    let studentMiddlename = document.getElementById('middlename').value;
    let studentFaculty = document.getElementById('faculty').value.trim();
    let studentBirthDate = new Date(document.getElementById('year-of-birth').value);
    let studentStartStudy = parseInt(document.getElementById('year-of-admission').value);

    const studentObj = {
        name: studentName,
        surename: studentSurename,
        middlename: studentMiddlename,
        faculty: studentFaculty,
        birthDate: studentBirthDate,
        startStudy: studentStartStudy,
    }

    arrayStudents.push(studentObj)
    addStudentInTable(studentObj)

    form.reset();
});

function validation(form) {
    function removeError(input) {
        const parent = input.parentNode;

        if (parent.classList.contains('error')) {
            parent.querySelector('.error-label').remove();
            parent.classList.remove('error');
        }
    }

    function createError(input, text) {
        const parent = input.parentNode;
        const errorLabel = document.createElement('label');
        errorLabel.classList.add('error-label');
        errorLabel.textContent = text;

        parent.classList.add('error');
        parent.appendChild(errorLabel);
    }

    let result = true;
    const allInputs = form.querySelectorAll('.input');
    for (const input of allInputs) {
        removeError(input);
        if (input.value == '') {
            createError(input, 'Поле не заполнено');
            result = false;
        }
    }

    const yearOfAdmissionInput = document.getElementById('year-of-admission');
    const inputValue = parseInt(yearOfAdmissionInput.value);
    const currentYear = new Date().getFullYear();

    if (inputValue < 2000) {
        createError(yearOfAdmissionInput, 'Год поступления не может быть менее 2000 года');
        result = false;
    } else if (inputValue > currentYear) {
        createError(yearOfAdmissionInput, 'Год поступления не может быть больше текущего года');
        result = false;
    }

    const birthDateInput = document.getElementById('year-of-birth');
    const birthYear = parseInt(birthDateInput.value);

    if (birthYear.toString().length > 4) {
        birthDateInput.value = birthYear.toString().slice(0, 4);
        createError(birthDateInput, 'Год рождения должен содержать ровно 4 символа');
        result = false;
    } else {
        const currentYear = new Date().getFullYear();
        const minYear = 1900;
        const maxYear = currentYear - 15;

        if (birthYear < minYear || birthYear > maxYear) {
            createError(birthDateInput, `Год рождения должен быть от ${minYear} до ${maxYear}`);
            result = false;
        }
    }

    return result;
}

const btnOpen = document.getElementById('btn-students-open');
btnOpen.addEventListener('click', function () {
    const addStudentBlock = document.querySelector('.add-students');
    addStudentBlock.classList.add('add-students--active');
    btnOpen.classList.add('btn-students-open')

});

const btnClose = document.getElementById('btn-students-close');
btnClose.addEventListener('click', function () {
    const addStudentBlock = document.querySelector('.add-students');
    addStudentBlock.classList.remove('add-students--active');
    btnOpen.classList.remove('btn-students-open')

});

function updateTable(arr) {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = '';

    function formatDateAndAge(dateString) {
        const birthDate = new Date(dateString);
        const currentDate = new Date();

        const dd = String(birthDate.getDate()).padStart(2, '0');
        const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
        const yyyy = birthDate.getFullYear();

        const age = currentDate.getFullYear() - birthDate.getFullYear() - (currentDate < new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()));

        return `${dd}.${mm}.${yyyy} (${age} лет)`;
    }

    for (const student of arr) {
        const row = document.createElement('tr');

        const fullNameCell = document.createElement('td');
        fullNameCell.textContent = `${student.surename} ${student.name} ${student.middlename}`;
        row.appendChild(fullNameCell);

        const facultyCell = document.createElement('td');
        facultyCell.textContent = student.faculty;
        row.appendChild(facultyCell);

        const birthDateCell = document.createElement('td');
        birthDateCell.textContent = formatDateAndAge(student.birthDate);
        row.appendChild(birthDateCell);

        const startStudyCell = document.createElement('td');
        const currentYear = new Date().getFullYear();
        const graduationYear = student.startStudy + 4;
        const course = currentYear - student.startStudy + 1;

        if (currentYear > graduationYear) {
            startStudyCell.textContent = `${student.startStudy}-${graduationYear} (закончил обучение)`;
        } else {
            startStudyCell.textContent = `${student.startStudy}-${graduationYear} (${course} курс)`;
        }

        row.appendChild(startStudyCell);

        tableBody.appendChild(row);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const sortFullName = document.getElementById('fullname');
    const sortFaculty = document.getElementById('faculti');
    const sortDateBirthday = document.getElementById('date');
    const sortStartStudy = document.getElementById('startstudy');

    let sortDirection = {};

    function compareFullName(studentA, studentB) {
        const fullNameA = `${studentA.surename} ${studentA.name} ${studentA.middlename}`;
        const fullNameB = `${studentB.surename} ${studentB.name} ${studentB.middlename}`;
        return fullNameA.localeCompare(fullNameB) * sortDirection.fullName;
    }

    function sortByFaculty(studentA, studentB) {
        return studentA.faculty.localeCompare(studentB.faculty) * sortDirection.faculty;
    }

    function sortByDateOfBirth(studentA, studentB) {
        return (new Date(studentA.birthDate) - new Date(studentB.birthDate)) * sortDirection.dateOfBirth;
    }

    function sortByStartStudy(studentA, studentB) {
        return (studentA.startStudy - studentB.startStudy) * sortDirection.startStudy;
    }

    function toggleSortDirection(property) {
        if (sortDirection[property] === undefined) {
            sortDirection[property] = 1;
        } else {
            sortDirection[property] *= -1;
        }
    }

    sortFullName.addEventListener('click', function () {
        toggleSortDirection('fullName');
        arrayStudents.sort(compareFullName);
        updateTable(arrayStudents);
    });

    sortFaculty.addEventListener('click', function () {
        toggleSortDirection('faculty');
        arrayStudents.sort(sortByFaculty);
        updateTable(arrayStudents);
    });

    sortDateBirthday.addEventListener('click', function () {
        toggleSortDirection('dateOfBirth');
        arrayStudents.sort(sortByDateOfBirth);
        updateTable(arrayStudents);
    });

    sortStartStudy.addEventListener('click', function () {
        toggleSortDirection('startStudy');
        arrayStudents.sort(sortByStartStudy);
        updateTable(arrayStudents);
    });

});

const searchBlock = document.querySelector('.search-students')
const searchBtn = document.getElementById('btn-filter')
const searchBtnFilter = document.getElementById('filter-students')
const searchBtnClose = document.getElementById('filter-students-close')

searchBtn.addEventListener('click', function () {
    searchBlock.classList.add('search-students--active')
    searchBtn.classList.add('btn-filter-none')
})

searchBtnClose.addEventListener('click', function (event) {
    event.preventDefault()
    searchBlock.classList.remove('search-students--active')
    searchBtn.classList.remove('btn-filter-none')
})

function filter(arr, filterFn) {
    return arr.filter(filterFn);
}

function render(arr) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    const fullNameFilter = document.getElementById('fullname-filter').value.trim().toLowerCase();
    const facultyFilter = document.getElementById('faculty-filter').value.trim().toLowerCase();
    const startStudyFilter = document.getElementById('startstudy-filter').value.trim();
    const endStudyFilter = document.getElementById('endstudy-filter').value.trim();

    let newArr = [...arr];

    if (fullNameFilter !== '') {
        newArr = filter(newArr, student => getFullName(student).toLowerCase().includes(fullNameFilter));
    }
    if (facultyFilter !== '') {
        newArr = filter(newArr, student => student.faculty.toLowerCase().includes(facultyFilter));
    }
    if (startStudyFilter !== '') {
        newArr = filter(newArr, student => student.startStudy.toString().includes(startStudyFilter));
    }
    if (endStudyFilter !== '') {
        const endStudyFilterValue = parseInt(endStudyFilter);
        newArr = filter(newArr, student => (student.startStudy + 4).toString().includes(endStudyFilterValue));
    }

    updateTable(newArr);
}




const filterForm = document.getElementById('students-filter')
filterForm.addEventListener('submit', function (event) {
    event.preventDefault()
    render(arrayStudents);
});






