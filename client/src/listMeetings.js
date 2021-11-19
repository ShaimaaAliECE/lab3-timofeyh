import axios from "axios";
import React, { useEffect, useState } from "react";

export const MeetingList = ({user, openMeeting}) => { 
    const [list, setList] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.post("/api/listMeetings", {
            user:user
        }).then(res => setList(res.data))
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (list !== null) setLoaded(true);
    },[list])

    return (loaded&&
        <div>
            <ul>
                {
                    list.map(m => 
                        <button key={m.meetingID} onClick={() => openMeeting(m.meetingID)}>{m.meetingID + " - " + m.name}</button>
                    )
                }
            </ul>
        </div>
    );
}