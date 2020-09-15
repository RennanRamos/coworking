import React, { useState} from "react";
import { useHistory } from "react-router-dom";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";

export default function ResetPassword() {
    const [email, setEmail] = useState();
    const [error, setError] = useState();

    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        await Axios.post("http://104.131.46.234:5000/users/resetPassword", {email});
        history.push("/login");
    };
    
    return (
        <div className = "page">
            <h2>Reset</h2>
            {error && (
                <ErrorNotice message = {error} clearError = {() => setError(undefined)}/>
            )}
            <form className = "form" onSubmit = {submit}>
                <label htmlFor = "login-email">Email</label>
                <input 
                    id = "login-email"
                    type = "email"
                    onChange = {(e) => setEmail(e.target.value)}
                />
                <input type = "submit" value = "Send Email" />
            </form>
        </div>
    )
}