const mysql = require("mysql");

function newConnection() {
    let conn = mysql.createConnection({
        host:'104.197.55.101',
        user: 'root',
        password: 'root',
        database: 'skedul_db'
    });

    return conn;
}

module.exports = newConnection;