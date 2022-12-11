const mysql = require("mysql2/promise");
require('dotenv').config();

let connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 100000,
    connectionLimit: 10,
    waitForConnections: true,
    enableKeepAlive: true
});

module.exports = connection