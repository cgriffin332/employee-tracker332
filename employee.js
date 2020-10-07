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

  // Add your password
  password: "",
  database: "employee_trackerDB",
});
let employeeNamesArray = [];
let departmentsArray = ["Sales", "Finance", "Legal", "Engineering"];
let rolesArray = ["Sales Rep", "Accountant", "Lawyer", "Software Engineer"];

// run the program
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // opening design
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
      //begin questions
      init();
    }
  );
});

//function to ask all questions
function init() {
  getEmployeeNames();
  // updateDepartments();
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "do",
        choices: [
          "View employees.",
          "View departments.",
          "View roles.",
          "Add a new department.",
          "Add a new role.",
          "Add an employee.",
          "Update employee role.",
          "Remove an Employee.",
          "View the budget.",
          "I am done.",
        ],
      },
    ])
    .then((choice) => {
      if (choice.do === "Remove an Employee.") {
        removeEmployeeQuestions();
      } else if (choice.do === "Add an employee.") {
        addEmployeeQuestions();
      } else if (choice.do === "Add a new department.") {
        addDepartments();
      } else if (choice.do === "Add a new role.") {
        addRoles();
      } else if (choice.do === "I am done.") {
        connection.end();
      } else if (choice.do === "View employees.") {
        getEmployeeInfo();
      } else if (choice.do === "View departments.") {
        getDepartments();
      } else if (choice.do === "View roles.") {
        getRoles();
      } else if (choice.do === "Update employee role.") {
        updateEmployeeRoles();
      } else if (choice.do === "View the budget.") {
        getBudget();
      }
    });
}

// EMPLOYEE FUNCTIONS

//get employee info
function getEmployeeInfo() {
  connection.query(
    `SELECT employee.id, employee.first_name AS first, employee.last_name AS last, role.title AS role, department.name as department, role.salary, CONCAT (managers.first_name , " " , managers.last_name) AS Manager
  FROM role
  INNER JOIN employee ON employee.role_id = role.id 
  INNER JOIN department ON department.id = role.department_id
  LEFT JOIN employee AS managers ON employee.manager_id=managers.id
  ORDER BY employee.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      // connection.end();
      init();
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
//get employees
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
      console.log("Employee removed!");
      getEmployeeInfo();
    });
}
//add employees
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
      } else if (choice.role === "Software Engineer") {
        role_id = 8;
        manager_id = 7;
      } else {
        role_id = 9;
        manager_id = 1;
      }
      addEmployee(choice.first, choice.last, role_id, manager_id);
      console.log("Employee added!");
      getEmployeeNames();
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
//update employee roles
function updateEmployeeRoles() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        name: "name",
        choices: employeeNamesArray,
      },
      {
        type: "list",
        message: "What role would you like to assign?",
        name: "role",
        choices: rolesArray,
      },
    ])
    .then(function (data) {
      if (data.role === "Sales Rep") {
        num = 2;
      } else if (data.role === "Accountant") {
        num = 4;
      } else if (data.role === "Lawyer") {
        num = 6;
      } else if (data.role === "Software Engineer") {
        num = 8;
      } else {
        num = 9;
      }
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: num,
          },
          {
            first_name: data.name.split(" ")[0],
          },
        ],
        function (err, res) {
          if (err) throw err;
          console.log("Employee updated!");
          init();
        }
      );
    });
}

// DEPARTMENT FUNCTIONS

// get departments
function getDepartments() {
  connection.query(
    `SELECT * FROM department;
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
      // connection.end();
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
      console.log("Department Added!");
      getDepartments();
    });
}

// ROLE FUNCTIONS

//get roles
function getRoles() {
  connection.query(
    `SELECT * FROM role;
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
      // connection.end();
    }
  );
}
//add role
function addRoles() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is role name?",
        name: "name",
      },
      {
        type: "input",
        message: "What is the role salary?",
        name: "salary",
      },
      {
        type: "list",
        message: "What is the Departmant id?",
        name: "department",
        choices: departmentsArray,
      },
    ])
    .then(function (choice) {
      if (choice.department === "Sales") {
        num = 1;
      } else if (choice.department === "Finance") {
        num = 2;
      } else if (choice.department === "Legal") {
        num = 3;
      } else if (choice.department === "Engineering") {
        num = 4;
      } else {
        num = 5;
      }
      console.log(`department: ${choice.department} num: ${num}`);
      rolesArray.push(choice.name);
      connection.query(
        `INSERT INTO role (title, salary, department_id)
    VALUES ("${choice.name}", ${choice.salary}, ${num})
    `,
        function (err, res) {
          if (err) throw err;
          console.log("Role added!");
          getRoles();
        }
      );
    });
}

// BUDGET FUNCTION

//get budget function
function getBudget() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which budget would you like to see?",
        name: "department",
        choices: [
          "Sales",
          "Finance",
          "Legal",
          "Engineering",
          "Total",
          "Go Back",
        ],
      },
    ])
    .then(function (choice) {
      if (choice.department === "Sales") {
        end = "WHERE department.id = 1";
      } else if (choice.department === "Finance") {
        end = "WHERE department.id = 2";
      } else if (choice.department === "Legal") {
        end = "WHERE department.id = 3";
      } else if (choice.department === "Engineering") {
        end = "WHERE department.id = 4";
      } else if (choice.department === "Total") {
        end = "";
      } else {
        init();
        return;
      }
      connection.query(
        `SELECT SUM(role.salary) AS budget FROM role INNER JOIN employee ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id ${end}
        `,
        function (err, res) {
          if (err) throw err;
          console.table(res);
          getBudget();
        }
      );
    });
}
