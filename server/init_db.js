const mysql = require("mysql");

let conn = mysql.createConnection({
    host:'104.197.55.101',
    user: 'root',
    password: 'root',
    database: 'skedul_db'
});

conn.connect();


conn.query(
    `DROP TABLE Meetings;`
    , (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Users Table Dropped!");
    }
);

conn.query(
    `DROP TABLE Users;`
    , (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Users Table Dropped!");
    }
);

conn.query(
    `
    CREATE TABLE Users (
        username varchar(50),
        password varchar(50),
        PRIMARY KEY (username)
    );
    `,
    (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Users Table Created!");
    }
);

conn.query(
    `
    CREATE TABLE Meetings (
        name varchar(50),
        owner varchar(50),
        PRIMARY KEY (name, owner),
        FOREIGN KEY (owner) REFERENCES Users(username)
    );
    `,
    (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Meetings Table Created!");
    }
);

conn.query(
    `
    DESCRIBE Meetings;
    `,
    (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log(rows);
    }
);

conn.end();