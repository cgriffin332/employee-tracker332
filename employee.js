const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Sdat687!",
  database: "employee_trackerDB",
});
let employeeNamesArray = [];

function init() {
  getEmployeeNames();
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "do",
        choices: ["Remove an Employee.", "Add an employee."],
      },
    ])
    .then((choice) => {
      if (choice.do === "Remove an Employee.") {
        removeEmployeeQuestions();
      }
      else if (choice.do === "Add an employee.") {
        addEmployeeQuestions();
      }
    });
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // getEmployeeInfo();
  //getEmployeeNames();
  //getDepartments();
  //getRoles();
  //addEmployeeQuestions();
  // getEmployeeNames();
  // removeEmployeeQuestions();
  init();
});
//get employee info
function getEmployeeInfo() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id
  FROM role
  INNER JOIN employee ON employee.role_id = role.id 
  INNER JOIN department ON department.id = role.department_id
  ORDER BY employee.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    }
  );
}

function removeEmployeeQuestions() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee would you like to remove?",
        name: "name",
        choices: employeeNamesArray,
      },
    ])
    .then(function (choice) {
      connection.query(
        "DELETE FROM employee WHERE first_name = ?",
        [choice.name.split(" ")[0]],
        function (err, res) {
          if (err) throw err;
        }
      );
      getEmployeeInfo();
    });
}

function addEmployeeQuestions() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last",
      },
      {
        type: "list",
        message: "What is your preferred method of communciation?",
        name: "role",
        choices: ["Sales Rep", "Accountant", "Lawyer", "Engineer"],
      },
    ])
    .then(function (choice) {
      if (choice.role === "Sales Rep") {
        role_id = 2;
        manager_id = 1;
      } else if (choice.role === "Accountant") {
        role_id = 4;
        manager_id = 3;
      } else if (choice.role === "Lawyer") {
        role_id = 6;
        manager_id = 5;
      } else if (choice.role === "Engineer") {
        role_id = 8;
        manager_id = 7;
      }
      addEmployee(choice.first, choice.last, role_id, manager_id);
      getEmployeeInfo();
    });
}
//function to add new employee
function addEmployee(first, last, role_id, manager_id) {
  connection.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES ("${first}", "${last}", ${role_id}, ${manager_id})`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}
//get employee names
function getEmployeeNames() {
  connection.query(
    `SELECT CONCAT(first_name, ' ', last_name) FROM employee;
    `,
    function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        employeeNamesArray.push(res[i]["CONCAT(first_name, ' ', last_name)"]);
      }
      return employeeNamesArray;
    }
  );
}
// //get departments
// function getDepartments() {
//   connection.query(
//     `SELECT name FROM department;
//     `,
//     function (err, res) {
//       if (err) throw err;
//       console.table(res);
//       connection.end();
//     }
//   );
// }
// //add department
// function addDepartments(name) {
//   connection.query(
//     `INSERT INTO department (name)
//     VALUES (${name})
//     `,
//     function (err, res) {
//       if (err) throw err;
//       console.table(res);
//     }
//   );
// }
// //get roles
// function getRoles() {
//   connection.query(
//     `SELECT title FROM role;
//     `,
//     function (err, res) {
//       if (err) throw err;
//       console.table(res);
//       connection.end();
//     }
//   );
// }
// //add role
// function addRoles(title, salary, department_id) {
//   connection.query(
//     `INSERT INTO role (title, salary, department_id)
//     VALUES (${title}, ${salary}, $${department_id})
//     `,
//     function (err, res) {
//       if (err) throw err;
//       console.table(res);
//     }
//   );
// }
