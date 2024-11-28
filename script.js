async function fetchStudents() {
  try {
      const response = await fetch('./students.json'); 
      if (!response.ok) throw new Error('Failed to fetch student data');
      const students = await response.json();

      if (Array.isArray(students)) {
          renderStudents(students);
          initializeButtons(students);
      } else {
          console.error('The fetched data is not an array:', students);
      }
  } catch (error) {
      console.error('Error fetching students:', error);
  }
}

function renderStudents(students) {
  const container = document.getElementById('table-container');
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Class</th>
          <th>Marks</th>
          <th>Passing</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
  `;

  students.forEach(student => {
      tableHTML += `
        <tr>
          <td>${student.id}</td>
          <td>
            <div style="display: flex; align-items: center;">
              <img src="${student.img_src}" alt="Student Image" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
              ${student.first_name} ${student.last_name}
            </div>
          </td>
          <td>${student.gender}</td>
          <td>${student.class}</td>
          <td>${student.marks}</td>
          <td>${student.passing ? 'Passing' : 'Failed'}</td>
          <td>${student.email}</td>
        </tr>
      `;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;
}

function searchStudents(students, searchTerm) {
  const filteredStudents = students.filter(student =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  renderStudents(filteredStudents);
}

function sortStudents(students, criterion) {
  if (!Array.isArray(students)) return;

  let sortedStudents;
  switch (criterion) {
      case 'name-asc':
          sortedStudents = [...students].sort((a, b) => 
              `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
          );
          break;
      case 'name-desc':
          sortedStudents = [...students].sort((a, b) => 
              `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`)
          );
          break;
      case 'marks':
          sortedStudents = [...students].sort((a, b) => a.marks - b.marks);
          break;
      case 'class':
          sortedStudents = [...students].sort((a, b) => a.class - b.class);
          break;
      case 'passing':
          sortedStudents = students.filter(student => student.passing);
          break;
      case 'gender':
          sortByGender(students);
          return; 
      default:
          sortedStudents = students; 
  }
  renderStudents(sortedStudents);
}

function sortByGender(students) {
  const maleStudents = students.filter(student => student.gender === 'Male');
  const femaleStudents = students.filter(student => student.gender === 'Female');
  const container = document.getElementById('table-container');

  let maleTableHTML = `
    <h2>Male Students</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Class</th>
          <th>Marks</th>
          <th>Passing</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
  `;
  maleStudents.forEach(student => {
      maleTableHTML += `
        <tr>
          <td>${student.id}</td>
          <td>${student.first_name} ${student.last_name}</td>
          <td>${student.gender}</td>
          <td>${student.class}</td>
          <td>${student.marks}</td>
          <td>${student.passing ? 'Passing' : 'Failed'}</td>
          <td>${student.email}</td>
        </tr>
      `;
  });
  maleTableHTML += `</tbody></table>`;

  let femaleTableHTML = `
    <h2>Female Students</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Class</th>
          <th>Marks</th>
          <th>Passing</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
  `;
  femaleStudents.forEach(student => {
      femaleTableHTML += `
        <tr>
          <td>${student.id}</td>
          <td>${student.first_name} ${student.last_name}</td>
          <td>${student.gender}</td>
          <td>${student.class}</td>
          <td>${student.marks}</td>
          <td>${student.passing ? 'Passing' : 'Failed'}</td>
          <td>${student.email}</td>
        </tr>
      `;
  });
  femaleTableHTML += `</tbody></table>`;

  container.innerHTML = maleTableHTML + femaleTableHTML;
}

function initializeButtons(students) {
  document.getElementById('sort-az').addEventListener('click', () => sortStudents(students, 'name-asc'));
  document.getElementById('sort-za').addEventListener('click', () => sortStudents(students, 'name-desc'));
  document.getElementById('sort-marks').addEventListener('click', () => sortStudents(students, 'marks'));
  document.getElementById('sort-class').addEventListener('click', () => sortStudents(students, 'class'));
  document.getElementById('sort-passing').addEventListener('click', () => sortStudents(students, 'passing'));
  document.getElementById('sort-gender').addEventListener('click', () => sortStudents(students, 'gender'));

  document.getElementById('search-bar').addEventListener('input', event => searchStudents(students, event.target.value));
  document.getElementById('search-button').addEventListener('click', () => {
      const searchTerm = document.getElementById('search-bar').value;
      searchStudents(students, searchTerm);
  });
}

fetchStudents().then(students => {
  if (Array.isArray(students)) {
      initializeButtons(students);
  }});
