const { response } = require("express");
const express = require("express");
const newConnection = require("./connect_db");
const path = require('path');

const app = express();
const port = 80;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json());

app.get("/", (req, res) => {
    console.log("Server Accessed");
    console.log(path.join(__dirname, './client/app', 'index.html'))
    res.send();
});

app.get("/api/users", (req, res) => {
    console.log("Server Accessed");

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        SELECT * FROM Users;
        `
        , (err, rows, fields) => res.send(rows));

    conn.end();
});

app.post("/api/checkUser", (req, res) => {
    let username = req.body.usr;
    let password = req.body.pwd;

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Insert into Users(username, password)
        Values("${username}", "${password}");
        `
        , (err, rows, fields) => {
            res.send(rows);
        }
    );
    conn.end();
});

app.post("/api/checkUnique", (req, res) => {
    let voter = req.body.voter;
    let meeting = req.body.meeting;
    
    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Select * from 
        (
            Select 
                If(isnull(u.username), v.guest, u.username) as username 
            From Slots as s
            left join Votes as v on s.slotID = v.slot
            left join Users as u on v.user = u.userID
            where s.meeting=${meeting}
        ) as q
        where q.username = '${voter.username}'
        `
        , (err, rows, fields) => {
            console.log(err);
            res.send(rows);
        }
    )
})

app.post("/api/skedulMeeting", (req, res) => {
    let slot = req.body.slot;
    let meeting = req.body.meeting;
    
    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Update Meetings 
        Set status = "SKEDULED"
        where meetingID = ${meeting}
        `
        , (err, rows, fields) => {
            console.log(err);
            console.log(rows);
            conn.query(
                `
                Update Slots
                Set locked = true
                Where slotID = ${slot.slotid}
                `
                , (err, rows, fields) => {
                    console.log(err);
                    console.log(rows);
                }
            )
            res.send(rows);
            conn.end();
        }
    )
})

app.post("/api/checkMeeting", (req, res) => {
    let id = req.body.id;

    let conn = newConnection();
    conn.connect();

    console.log(id);
    conn.query(
        `
        Select meetingID From Meetings
        Where meetingID=${id};
        `
        , (err, rows, fields) => {
            console.log(err);
            res.send(rows);
        }
    );
    conn.end();
});

app.post("/api/castVote", (req, res) => {
    let voter = req.body.voter;
    let slots = req.body.slots;

    console.log(voter);
    console.log(slots);

    let conn = newConnection();
    conn.connect();
    for (let i = 0; i < slots.length; i++) {
        conn.query(
            `
            Insert Into Votes(slot, user, guest)
            Values (${slots[i].slotid}, ${voter.userID}, '${voter.username}')
            `
            , (err, rows, fields) => {
                console.log(err);
                console.log(rows.insertId);
            }
        )
    }
    res.send();
    conn.end();
})

app.post("/api/listMeetings", (req, res) => {
    let user = req.body.user;

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Select meetingID, name From Meetings
        Where owner = '${user.userID}'
        `
        ,(err, rows, fields) => {
            console.log(err);
            res.send(rows);
        }
    )
})

app.post("/api/queryMeeting", (req, res) => {
    let id = req.body.id;
    console.log(id)

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        SELECT m.meetingID as meetingid
            ,m.status as status
            ,m.name as meeting
            ,s.slotID as slotid
            ,s.name as slot
            ,v.user as userid
            ,If(isnull(u.username),v.guest,u.username) as name
        FROM Meetings as m
        left join Slots as s on m.meetingID = s.meeting
        left join Votes as v on s.slotID = v.slot
        left join Users as u on v.user = u.userID
        Where m.meetingID=${id}; 
        `
        , (err, rows, fields) => {
            console.log(err);
            res.send(rows)
        });

    conn.end();
});

app.post("/api/getSlots", (req, res) => {
    let meeting = req.body.id;
    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Select slotid, name, locked From Slots 
        Where meeting=${meeting}
        `
        ,(err, rows, fields) => {
            res.send(rows);
    });
})

app.post("/api/checkOwner", (req, res) => {
    let meeting = req.body.meeting;
    let user = req.body.user;
    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Select * From Meetings
        Where owner=${user.userID} and meetingID=${meeting}
        `
        ,(err, rows, fields) => {
            console.log(err);
            console.log(rows);
            res.send(rows);
    });
})

app.post("/api/getVoters", (req, res) => {
    let meeting = req.body.id;
    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Select 
            v.user as id
            , u.username as username
            , v.guest as guest
            , MAX(if(isnull(u.username), v.guest, u.username)) as name
        From Slots s 
        left join Votes v on s.slotID = v.slot
        left join Users u on v.user = u.userID
        where s.meeting=${meeting} and (v.user is not null or u.username is not null or v.guest is not null)
        group by v.user, u.username, v.guest
        `
        ,(err, rows, fields) => {
            console.log(err);
            res.send(rows);
    });
})

app.post("/api/createMeeting", (req, res) => {
    let name = req.body.name;
    let owner = req.body.owner;
    let slots = req.body.slots;
    let meetingID;

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Insert into Meetings(name, owner)
        Values("${name}", ${owner});
        `
        , (err, rows, fields) => {
            meetingID=rows.insertId;
            for (let i = 0; i < slots.length; i++) {
                conn.query(
                    `
                    Insert into Slots(name, meeting)
                    Values("${slots[i]}", ${meetingID});
                    `
                    , (err, rows, fields) => {
                        console.log(rows);
                    }
                );
            }
            res.send(rows);
            conn.end();
        }
    );
});

app.post('/api/login', (req,res) => {
    let username = req.body.usr;
    let password = req.body.pwd;

    let conn = newConnection();
    conn.connect();

    conn.query(
        `
        Select * From Users
        Where username = "${username}" and password = "${password}";
        `
        , (err, rows, fields) => {
            res.send(rows);
        }
    );
})

app.listen(port, () => console.log(`Server is listening on port ${port}.`));