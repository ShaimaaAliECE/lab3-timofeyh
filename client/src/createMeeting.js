import axios from "axios";
import React, { useState } from "react";
import { useLogin } from "./useLogin";

export const CreateMeeting = ({user, setMeeting}) => { 
    const [meeting, useMeeting] = useState({name:'', owner:user.userID});
    const [id, setID] = useState(null);
    const [slots, setSlots] = useState([]);

    const addSlot = (e) => {
        e.preventDefault();
        console.log(slots)
        setSlots(s => [...s, {i:s.length, name:''}]);
    }

    const removeSlot = (e) => {
        e.preventDefault();
        console.log(e.target.name)
        setSlots([...remove(e.target.name, slots)]);
    }

    const changeSlotName = (e) => {
        e.preventDefault();
        console.log(e.target.name)
        setSlots([...change(e.target.name, e.target.value, slots)]);
    }

    const handleMeeting = (e) => {
        e.preventDefault();
        useMeeting({...meeting,name:e.target.value});
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (slots.length === 0) return;
        console.log('creating meeting');
        axios.post('/api/createMeeting', {
            name: meeting.name,
            owner: meeting.owner,
            slots: slots.map(s => s.name)
            })
            .then(res => { 
                console.log(res.data.insertId);
                setID(Number(res.data.insertId));
            })
            .catch(err => console.log(err));

    }

    return (
        <div>
            <form onSubmit ={submitHandler}>
                <input name="name" value={meeting.name} onChange={handleMeeting}/>
                <button name="addSlot" onClick={addSlot}>New Slot</button>
                <ul>
                {
                    slots.map(s =>
                        <li key={s.i}>
                        <input key={"slotname"+s.i} type="text" name={s.i} onChange={changeSlotName} value={s.name}></input>
                        <button key={"remove"+s.i} name={s.i} onClick={removeSlot}></button>
                        </li>
                    )
                }
                </ul>
                <button type="submit">Send Meeting</button>
            </form>
            {id>0 &&
                <>
                <h1>TABLE CREATED access using ID:{id}</h1>
                <button onClick={() => setMeeting(Number(id))}>View Table</button>
                </>
            }
        </div>
    );
}

const remove = (slot, slots) => {
    let out = [];
    let count = 0;
    for (let i = 0; i < slots.length; i++) {
        if (Number(slots[i].i) !== Number(slot)) {
            out.push({...slots[i],i:count});
            count++;
        }
    }
    return out;
}

const change = (slot, name, slots) => {
    let out = [];
    for (let i = 0; i < slots.length; i++) {
        if (Number(slots[i].i) !== Number(slot)) out.push({...slots[i]});
        else {
            let nameChange = {i:slots[i].i, name:name};
            out.push({...nameChange});
        }
    }
    return out;
}