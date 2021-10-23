const credentials = require('../credentials.json')
const mysql = require('mysql');

function mySQLConnection() {
    return mysql.createConnection({
      host: credentials.host,
      user: credentials.user,
      password: credentials.password,
      database: credentials.database
    });
}

const db = mySQLConnection()
db.connect()

module.exports = {
    db: db
}