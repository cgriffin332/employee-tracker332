-- Starter information

DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "Smith", 1, null), ("Fred", "Williams", 2, 1), ("Jessica", "Waterhouse", 3, null), ("Mark", "Hall", 4, 3), ("Calvin", "Griffin", 5, null), ("Susan", "Fisk", 6, 5), ("Holly", "Razor", 7, null), ("Lindsey", "Ashton", 8, 7);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary decimal,
  department_id INT,
  PRIMARY KEY (id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Sales Rep", 70000, 1), ("Head of Finance", 150000, 2), ("Accountant", 120000, 2), ("Head of Legal", 250000, 3), ("Lawyer", 200000, 3), ("Lead Engineer", 150000, 4), ("Software Engineer", 120000, 4);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Sales"), ("Finance"), ("Legal"), ("Engineering");
