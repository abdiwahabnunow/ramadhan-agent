// // const studentRegister=[{nameInput: "John Doe", indexInput: "12345"}];



// // document.addEventListener('DOMContentLoaded', readyNow);
 

// // function readyNow() {
// //   console.log("DOM is loaded!");
// //   render();
// // }

// // function addStudent(event) {
// //     event.preventDefault();
// //   console.log("Adding student...");
// //   const nameInput = document.getElementById('student-name');
// //   const indexInput = document.getElementById('index_number');


// //   const newStudent = {nameInput, indexInput};
// //     console.log("New student:", newStudent);
// // // Here you would typically send the new student data to the server and update the student list

// // studentRegister.push(newStudent);


// // document.getElementById('student-name').value = '';
// // document.getElementById('index_number').value = '';

// // readyNow();

// // }

// // function render() {
// //   console.log("Rendering student list...");
// //    const studentList = document.getElementById('student-list');
// //   studentList.innerHTML = '';       
// // //   // Here you would typically fetch the student list from the server and update the DOM accordingly
// // //   studentRegister.forEach(student => {
// // //     const listItem = document.createElement('li');
// // //     listItem.textContent = `Name: ${student.nameInput.value}, Index Number: ${student.indexInput.value}`;
// // //     studentList.appendChild(listItem);
// // //   }); 
// // for(const student of studentRegister){
// //     studentList.innerHTML += `<li>Name: ${student.nameInput.value}, Index Number: ${student.indexInput.value}</li>`;
// // }   
// //   <button onclick="DeleteStudent(event)">Delete Student</button>

// // }           
// // function DeleteStudent(event) {
// //   console.log("Deleting student...");
// //   const thisButton = event.target
// //   thisButton.remove();
// //   // Here you would typically send a request to the server to delete the student and update the student list
// //   studentRegister.pop();
// //   readyNow();
// // }

// function addStudent(event) {
//   event.preventDefault();

//   const nameInput = document.getElementById('student-name');
//   const indexInput = document.getElementById('index_number');

//   const newStudent = {
//     nameInput: nameInput.value,
//     indexInput: indexInput.value
//   };

//   studentRegister.push(newStudent);

//   nameInput.value = '';
//   indexInput.value = '';

//   render();
// }

// function render() {
//   const studentList = document.getElementById('student-list');
//   studentList.innerHTML = '';

//   studentRegister.forEach((student, index) => {
//     const li = document.createElement('li');

//     li.innerHTML = `
//       Name: ${student.nameInput}, Index: ${student.indexInput}
//       <button onclick="deleteStudent(${index})">Delete</button>
//     `;

//     studentList.appendChild(li);
//   });
// }

// function deleteStudent(index) {
//   studentRegister.splice(index, 1);
//   render();
// }


const studentRegister = [];

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('student-form')
    .addEventListener('submit', addStudent);

  render();
});

function addStudent(event) {
  event.preventDefault();

  const nameInput = document.getElementById('student-name').value;
  const indexInput = document.getElementById('index_number').value;

  const newStudent = { nameInput, indexInput };

  studentRegister.push(newStudent);

  console.log(studentRegister); // debug

  document.getElementById('student-name').value = '';
  document.getElementById('index_number').value = '';

  render();
}

function render() {
  const studentList = document.getElementById('student-list');
  studentList.innerHTML = '';

  studentRegister.forEach((student, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      Name: ${student.nameInput}, Index: ${student.indexInput}
      <button onclick="deleteStudent(${index})">Delete</button>
    `;

    studentList.appendChild(li);
  });
}

function deleteStudent(index) {
  studentRegister.splice(index, 1);
  render();
}