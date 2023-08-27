const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'March19!',
    database: 'employee_db'
})

module.exports = db;