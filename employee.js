const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");
const figlet = require("figlet");

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
let departmentsArray = ["Sales", "Finance", "Legal", "Engineering"];
let rolesArray = ["Sales Rep", "Accountant", "Lawyer", "Software Engineer"];

function init() {
  getEmployeeNames();
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "do",
        choices: [
          "Remove an Employee.",
          "Add an employee.",
          "Add a new department",
        ],
      },
    ])
    .then((choice) => {
      if (choice.do === "Remove an Employee.") {
        removeEmployeeQuestions();
      } else if (choice.do === "Add an employee.") {
        addEmployeeQuestions();
      } else if (choice.do === "Add a new department") {
        addDepartments();
      }
    });
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  figlet.text(
    "GRIFFIN",
    {
      font: "Ghost",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
      init();
    }
  );
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
        message: "What is the Employee's role?",
        name: "role",
        choices: rolesArray,
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
      } else {

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
//get departments
function getDepartments() {
  connection.query(
    `SELECT * FROM department;
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    }
  );
}
//add department
function addDepartments() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "name",
      },
    ])
    .then(function (choice) {
      connection.query(
        `INSERT INTO department (name)
      VALUES ("${choice.name}")
        `,
        function (err, res) {
          if (err) throw err;
          departmentsArray.push(choice.name);
        }
      );
      getDepartments();
    });
}
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
