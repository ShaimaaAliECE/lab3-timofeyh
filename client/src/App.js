import React, { useState, useEffect} from "react";
import { CreateMeeting } from "./createMeeting";
import { MeetingList } from "./listMeetings";
import { LoginPage } from "./login";
import { Meeting } from "./Meeting";
import { SearchBar } from "./searchMeetings";
import "../src/App.css";

export function App() {
const [loading, setLoading] = useState(true);
const [users, setUsers] = useState([]);  
const [user, setUser] = useState({userID: 0, username:'',password:'',signedin:false});
const [meeting, setMeeting] = useState(0);
const [newMeet, setNewMeet] = useState(false);  


useEffect(() => {
    if (meeting>0) setNewMeet(false);
    console.log(meeting);
}, [meeting]);

    return (
        <div>
            {!user.signedin && 
                <LoginPage login={(id,u,p) => setUser({userID:id,username:u,password:p,signedin:true})}/>
            }
             {meeting>0 &&
                <>
                <button onClick={() => setMeeting(null)}> X </button>
                <Meeting meeting={meeting} user={user} setMeeting={() => setMeeting(null)}/> 
                </>
            }
            {user.signedin &&
                <>
                <h1>{"Hello " + user.username}</h1>
                {!meeting>0 &&
                    <>
                    {newMeet &&
                        <CreateMeeting user={user} setMeeting={(id) => setMeeting(Number(id))}/>
                    }
                    {!newMeet &&
                        <button onClick={() => setNewMeet(true)}>New Meeting</button>
                    }
                    </>
                }
                </>
            }
            {!meeting>0 &&
                <>
                <SearchBar openMeeting={(id) => {setMeeting(Number(id))}}/>
                {user.signedin&& <MeetingList user={user} openMeeting={(id) => setMeeting(Number(id))}/>}
                </>
            }
        </div>
    )
}