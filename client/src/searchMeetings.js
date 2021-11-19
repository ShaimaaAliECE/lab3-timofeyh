import axios from "axios";
import React, { useState } from "react";

export const SearchBar = ({openMeeting}) => { 
    const [search, setSearch] = useState(null);

    const handleChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/checkMeeting', {
            id:search
        }).then(res => {
            if (res.data.length>0) {
                openMeeting(search);
                console.log(res.data.length)
            }
        }).catch(err => console.log(err));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={search} onChange={handleChange}/>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}