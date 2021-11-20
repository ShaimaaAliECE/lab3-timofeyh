const mysql = require("mysql");

function newConnection() {
    let conn = mysql.createConnection({
        host:'104.198.141.4',
        user: 'root',
        password: 'root',
        database: 'skedul_db'
    });

    return conn;
}

module.exports = newConnection;