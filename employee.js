const mysql = require("mysql");
const cTable = require('console.table');

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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  getEmployeeInfo();
  //getEmployeeNames();
  //getDepartments();
  //getRoles();
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
//function to add new employee
function addEmployee(first, last, role_id, manager_id){
  connection.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (${first}, ${last}, ${role_id}, ${manager_id})`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
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
      console.table(res);
      connection.end();
    }
  );
}
//get departments
function getDepartments() {
  connection.query(
    `SELECT name FROM department;
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    }
  );
}
//add department
function addDepartments(name) {
  connection.query(
    `INSERT INTO department (name)
    VALUES (${name})
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    }
  );
}
//get roles
function getRoles() {
  connection.query(
    `SELECT title FROM role;
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    }
  );
}
//add role
function addRoles(title, salary, department_id) {
  connection.query(
    `INSERT INTO role (title, salary, department_id)
    VALUES (${title}, ${salary}, $${department_id})
    `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    }
  );
}