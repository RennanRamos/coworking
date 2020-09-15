import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";

export default function NewPassword() {
    const [newPassword, setNewPassword] = useState();
    let {token} = useParams();
    const [error, setError] = useState();
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        const response = await Axios.post("http://localhost:5000/users/newPassword", {newPassword, token});
        console.log(response);
        history.push("/login");
    };
    
    return (
        <div className = "page">
            <h2>New Password</h2>
            {error && (
                <ErrorNotice message = {error} clearError = {() => setError(undefined)}/>
            )}
            <form className = "form" onSubmit = {submit}>
                <label htmlFor = "register-password">Password</label>
                <input 
                    id = "register-password"
                    type = "password"
                    onChange = {(e) => setNewPassword(e.target.value)}
                />
                <input type = "submit" value = "Change Password" />
            </form>
        </div>
    )
}