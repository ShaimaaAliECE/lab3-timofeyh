const { response } = require("express");
const express = require("express");
const newConnection = require("./connect_db");

const app = express();
const port = 5000;

app.get("/", (req, res) => {
    console.log("Server Accessed");

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Describe Votes;
        `
        , (err, rows, fields) => {


            let out;
            out = rows.map(
                r => 
                r.Field
            );

            res.send(out);
            console.log(out);
        }
    );

    conn.end();
});

app.listen(port, () => `Server is listening on port ${port}.`);