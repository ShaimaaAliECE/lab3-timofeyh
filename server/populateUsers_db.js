const newConnection = require("./connect_db");
const conn = newConnection();

for (let i = 0; i < 5; i++) {
    conn.query(
        `
        INSERT INTO Users (username, password)
        VALUES ('test${i}', 'test');
        `,
        (err, rows, fields) => {
            if (err) 
                console.log(err);
            else 
                console.log("Inserted 1 row!");
        }
    );
}

conn.end();