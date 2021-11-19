import axios from "axios";
import React, { useState } from "react";
import { useLogin } from "./useLogin";

export const LoginPage = ({login}) => {
    const [values, handleChange] = useLogin({username: '', password: ''});
    const [newVals, newValChange] = useLogin({newusername: '', newpassword: ''});
    const [register, setRegister] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(values);

        axios.post('/api/login', {
            usr: values.username,
            pwd: values.password
            })
            .then(res => { 
                const u = res.data[0];
                console.log(u.userID);
                u?login(u.userID, u.username, u.password):u;
            })
            .catch(err => console.log(err.data));

    }

    const registerHandler = (e) => {
        e.preventDefault();
        console.log(newVals);

        axios.post('/api/checkUser', {
            usr: newVals.newusername,
            pwd: newVals.newpassword
            })
            .then(res => { 
                const uID = res.data.insertId;
                console.log(uID);
                uID?login(uID, newVals.newusername, newVals.newpassword):uID;
            })
            .catch(err => console.log(err));
    }

    return (
        <div name="loginform">
            <form onSubmit={submitHandler}>
                <input 
                    type="text" 
                    name="username" 
                    value={values.username}
                    onChange={handleChange}
                />
                <input 
                    type="password"
                    name="password" 
                    value={values.password} 
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={() => setRegister(!register)}>Register</button>
            {register &&
                <form onSubmit={registerHandler}>
                    <input 
                        type="text" 
                        name="newusername" 
                        value={newVals.newusername}
                        onChange={newValChange}
                    />
                    <input 
                        type="password"
                        name="newpassword" 
                        value={newVals.newpassword} 
                        onChange={newValChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            }
        </div>
    );
}