import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLogin } from "./useLogin";

export const Meeting = ({meeting, user, setMeeting}) => { 
    const [rawTable, setRawTable] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [slots, setSlots] = useState(null);
    const [voters, setVoters] = useState(null);
    const [voter, setVoter] = useState(null);
    const [owner, setOwner] = useState(false);
    const [deciding, setDeciding] = useState(false);


    useEffect(() => {
        if (updated) return;

        identifyOwner();
        console.log(user);
        user.signedin?setVoter({...user}):setVoter({...user, userID:null});
        axios.post('/api/queryMeeting', {
            id:meeting
            })
            .then(res => res.data?setRawTable(res.data):res.data)
            .catch(err => console.log(err));

        axios.post('/api/getSlots', {
            id:meeting
            })
            .then(res => {
                if (res.data) {
                    setSlots(res.data.map(r => (
                        {...r, checked:false}
                    )))
                }
                })
            .catch(err => console.log(err));
        axios.post('/api/getVoters', {
            id:meeting
            })
            .then(res => res.data?setVoters(res.data):res.data)
            .catch(err => console.log(err));
    },[,updated]);

    useEffect(() => {
        console.log(rawTable);
        if (rawTable !== null && slots !== null && voters !== null)  setUpdated(true);
    }, [rawTable, slots, voters, owner]);

    const handleVote = (e) => {
        let i = Number(e.target.name);

        let out;
        if (deciding) out = oneVote(i, slots);
        else out = manyVote(i, slots);
        console.log(out);
        setSlots(() => ([...out]));
    }

    const handleVoter = (e) => {
        setVoter(v => ({...v, username:e.target.value}));
    }

    const handleSubmit = (e) => {
    
        console.log(prepareQuery(slots));
        console.log(prepareSchedule(slots));

        if (deciding) {
            axios.post("/api/skedulMeeting", {
                slot:prepareSchedule(slots),
                meeting:meeting
            }).then(setMeeting(null));
            return;
        }
        console.log("start:")
        axios.post("/api/checkUnique", {
            voter:voter,
            meeting:meeting
        }).then(res => {
            setVoter(v => ({...v, username:''}))
            if (res.data.length>0) return;

            axios.post("/api/castVote", {
                    voter:voter,
                    slots:prepareQuery(slots)
                }).then(res => {
                    console.log(res);
                    setMeeting(null);
                })
                .catch(err => console.log(err));
        })
    }

    const identifyOwner = () => {
        axios.post("/api/checkOwner", {
            meeting:meeting,
            user:user
        }).then(res => {
            console.log(res.data)
            console.log(res.data.length>0);
            if (!res.data.length>0) return;
            setOwner(res.data);
        })
    }

    const toggleDecision = () => {
        setDeciding(!deciding);
    }
    
    const renderMeeting = () => {
        let results = [...rawTable]
        let out = 
            <table>
                <thead>
                    <tr>
                        <td></td>
                        {slots.map((s,i) => <th key={i}>{s.name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr key="usersVotes">
                        <th>
                            {voter.signedin && <label>{voter.username}</label>}
                            {!voter.signedin && <input type="text" value={voter.username} onChange={handleVoter}/>}
                        </th>
                        {slots.map((s,i) => 
                            <td key={i}>
                            <input name={i} checked={s.checked || s.locked} disabled={!(String(results[0].status)=='PENDING')} type="checkbox" onChange={handleVote}></input>
                            </td>
                        )}
                    </tr>
                        {voters.map((v,i) => 
                            <tr key={i}>
                                <th>{v.name}</th>
                                {
                                    slots.map((s, i) => 
                                    <td key={i}>
                                            <input type="checkbox" disabled={true} defaultChecked={checkVote(s.name, v.name, results)}></input>
                                    </td>)
                                }
                            </tr>
                        )}
                    </tbody>
            </table>;
            return out;
    }

    return (
        <div>
            <h1>Displaying {meeting} {updated?String(rawTable[0].status)=="SKEDULED"?" -  Skeduled":"":""}</h1>
            <div className="meetTitle">
            <h2  className="inlineChild">
                {updated?String(rawTable[0].meeting):""}
            </h2>
            <button  className="inlineChild" onClick={() => setMeeting(null)}>X</button>
            </div>
            {owner&&updated&& 
                <>
                {String(rawTable[0].status)=="PENDING"&&
                    <>
                    <h1>YA I'M THE BOSS</h1>
                    <button onClick={toggleDecision}>MAKE THE FINAL DECISION</button>
                    </>
                }
                {deciding&& <h3>THE POWER IS IN MY HANDS</h3>}
                </>
            }
            <ul>  
            {updated&&
                <>
                {renderMeeting()}
                {String(rawTable[0].status)=="PENDING" && <button type="submit" disabled={voter.username.length===0} onClick={handleSubmit}>Submit</button>}
                </>
            }
            </ul>
        </div>
    );
}

const checkVote = (sName, vName, results) => {
    let out = false;
    for (let r = 0; r < results.length; r++) {
        if (sName===results[r].slot && vName===results[r].name) {
            out = true;
            break;
        }
    }
    return out;
}

const manyVote = (index, slots) => {
    let out = [];
    console.log(index)
    for (let i = 0; i < slots.length; i++) {
        if (i == index) out.push({...slots[i],checked:!slots[i].checked});
        else out.push(slots[i]);
    }
    return out;
};

const oneVote = (index, slots) => {
    let out = [];
    for (let i = 0; i < slots.length; i++) {
        let slot = {...slots[i]};
        if (i === index) slot.checked = true;
        else slot.checked = false;
        out.push(slot);
    }
    return out;
}

const prepareQuery = (slots) => {
    let out = [];
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].checked) out.push(slots[i]);
    }
    return out;
}

const prepareSchedule = (slots) => {
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].checked) return {...slots[i]};
    }   
}