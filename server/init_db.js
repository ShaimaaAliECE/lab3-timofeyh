const newConnection = require("./connect_db");
const conn = newConnection();

conn.query(
    `DROP TABLE Votes;`
    , (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Votes Table Dropped!");
    }
);

conn.query(
    `DROP TABLE Slots;`
    , (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Slots Table Dropped!");
    }
);

conn.query(
    `DROP TABLE Meetings;`
    , (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Meetings Table Dropped!");
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
        userID int NOT NULL AUTO_INCREMENT,
        username varchar(50) UNIQUE,
        password varchar(50),
        PRIMARY KEY (userID)
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
        meetingID int NOT NULL AUTO_INCREMENT,
        name varchar(50),
        owner int,
        status varchar(10) DEFAULT 'PENDING',
        PRIMARY KEY (meetingID),
        FOREIGN KEY (owner) REFERENCES Users(userID)
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
    CREATE TABLE Slots (
        slotID int NOT NULL AUTO_INCREMENT,
        name varchar(50),
        meeting int,
        locked boolean DEFAULT false,
        PRIMARY KEY (slotID),
        FOREIGN KEY (meeting) REFERENCES Meetings(meetingID)
    );
    `,
    (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Slots Table Created!");
    }
);

conn.query(
    `
    CREATE TABLE Votes (
        voteID int NOT NULL AUTO_INCREMENT,
        slot int,
        user int,
        guest varchar(50),
        PRIMARY KEY (voteID),
        FOREIGN KEY (slot) REFERENCES Slots(slotID),
        FOREIGN KEY (user) REFERENCES Users(userID),
        UNIQUE KEY (slot, user, guest)
    );
    `,
    (err, rows, fields) => {
        if (err) 
            console.log(err);
        else 
            console.log("Votes Table Created!");
    }
);

conn.end();