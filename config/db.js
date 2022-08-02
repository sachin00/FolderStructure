const mysql = require('mysql')
const db = require('../config/default.json')

const connectDB = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

module.exports = connectDB;