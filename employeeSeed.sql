DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "Smith", 1, null), ("Fred", "Williams", 2, 1), ("Jessica", "Waterhouse", 3, null), ("Mark", "Hall", 4, 3), ("Calvin", "Griffin", 5, null), ("Susan", "Fisk", 6, 5), ("Holly", "Razor", 7, null), ("Lindsey", "Ashton", 8, 7);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary decimal,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Sales Rep", 70000, 1), ("Head of Finance", 150000, 2), ("Accountant", 120000, 2), ("Head of Legal", 250000, 3), ("Lawyer", 200000, 3), ("Lead Engineer", 150000, 4), ("Software Engineer", 120000, 4);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Sales"), ("Finance"), ("Legal"), ("Engineering");

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT (managers.first_name , " " , managers.last_name) AS Manager
-- FROM role
-- INNER JOIN employee ON employee.role_id = role.id 
-- INNER JOIN department ON department.id = role.department_id
-- LEFT JOIN employee AS managers ON employee.manager_id=managers.id
-- ORDER BY employee.id;

-- SELECT CONCAT(first_name, ' ', last_name) FROM employee;
-- SELECT CONCAT(first_name, ' ', last_name) FROM employee WHERE id = 1;