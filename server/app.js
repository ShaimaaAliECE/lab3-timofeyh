const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => res.send("Hello Server World!"));

app.listen(port, () => `Server is listening on port ${port}.`);