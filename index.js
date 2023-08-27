const inquirer = require('inquirer')
const db = require('./config/connection')
const tables = require('console.table')

//Connect to DB
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database.');
    employeeTracker();
});

//App function starts
function employeeTracker() {
    //Main prompt
    inquirer.prompt([{
        type: 'list',
        name: 'main',
        message: 'Pick an Option.',
        choices: [
            'View Departments',
            'View Roles',
            'View Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Exit'
        ]
    }]).then((answer) => {
//If user chooses to view tables:
    //Departments:
        if (answer.main === 'View Departments') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log('Departments: ');
                console.table(result);
                employeeTracker();
            });
    //Roles:
        } else if (answer.main === 'View Roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log('Roles: ');
                console.table(result);
                employeeTracker();
            });
    //Employees:
        } else if (answer.main === 'View Employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log('Employees: ');
                console.table(result);
                employeeTracker();
            });

//If user chooses to add:
    //Department:
        } else if (answer.main === 'Add Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'Enter the name of the department you wish to add:',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Department must have a name!');
                        return false;
                    }
                }
            }]).then((answer) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answer.department], (err, result) => {
                    if (err) throw err;
                    console.log(`${answer.department} was added.`)
                    employeeTracker();
                });
            })
        } else if (answer.main === 'Add Role') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        //Role
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Role must have a name!');
                                return false;
                            }
                        }
                    },
                    {
                        //Salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Salary must be specified!');
                                return false;
                            }
                        }
                    },
                    {
                        // Department
                        type: 'list',
                        name: 'department',
                        message: 'Choose the corresponding department for this role:',
                        choices: () => {
                            const depArray = [];
                            for (let i = 0; i < result.length; i++) {
                                depArray.push(result[i].name);
                            }
                            return depArray;
                        }
                    }
                ]).then((answer) => {
                    // Linking the answer and the corresponding department name.
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answer.department) {
                            var department = result[i];
                        }
                    }

                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.role, answer.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`${answer.role} role was added.`)
                        employeeTracker();
                    });
                })
            });

    //Employee:
        } else if (answer.main === 'Add Employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        //First Name 
                        type: 'input',
                        name: 'firstName',
                        message: "What is the employee's first name?",
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log("Please type employee's first name!");
                                return false;
                            }
                        }
                    },
                    {
                        //Last Name
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name?",
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        //Employee Role
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            let newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        //Manager ID
                        type: 'input',
                        name: 'manager',
                        message: "Enter the id number for the employee's manager:",
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log("Must provide a valid id number!");
                                return false;
                            }
                        }
                    }
                ]).then((answer) => {
                    // Linking the answer and the corresponding role title.
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answer.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answer.firstName, answer.lastName, role.id, answer.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answer.firstName} ${answer.lastName} to the database.`)
                        employeeTracker();
                    });
                })
            });

//If user chooses to update:
        } else if (answer.prompt === 'Update An Employee Role') {

            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        //Choose an Employee
                        type: 'list',
                        name: 'employee',
                        message: "Which employee's role do you want to update?",
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            let employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        //Updating Role
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            let newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answer) => {
                    //Linking DB last name with answer last name
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].last_name === answer.employee) {
                            var name = result[i];
                        }
                    }

                    //Linking DB role title with answer role title
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].title === answer.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answer.employee} role to the database.`)
                        employeeTracker();
                    });
                })
            });

    //If user chooses to exit:
        } else if (answer.main === 'Exit') {
            db.end();
            console.log("Thanks for using the employee tracker! Come again.");
        }
    })
};