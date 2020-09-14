import React, { useContext } from "react";
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function AuthOptions() {
    const { userData, setUserData } = useContext(UserContext);

    const history = useHistory();

    const register = () => history.push("/register");
    const login = () => history.push("/login");
    const personal = () => history.push("/personalData");
    const meeting = () => history.push("/meeting");
    const workstation = () => history.push("/workstation");
    const meetingAdmin = () => history.push("/meetingAdmin");
    const workstationAdmin = () => history.push("/workstationAdmin");

    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined,
        })
        localStorage.setItem("auth-token", "");
    };

    
    return (
        <nav className = "auth-options">
            {
                console.log(userData)
            }
            
            {
                userData.user ? 
                    (<>                    
                        
                        {
                            userData.user.admin ? (<>
                                <button disabled = {!userData.user.accountKeyConfirmed} onClick = {workstationAdmin} > AdminWorkstation </button>
                                <button disabled = {!userData.user.accountKeyConfirmed} onClick = {meetingAdmin} > AdminMeeting </button>

                            </>): null
                        }
                        <button disabled = {!userData.user.accountKeyConfirmed} onClick = {workstation} > Workstation </button>
                        <button disabled = {!userData.user.accountKeyConfirmed} onClick = {meeting} > Meeting </button>
                        <button className = "abc" onClick = {personal} > User </button>
                        <button onClick = {logout} > Log out </button>
                    </>
                ) : 
                (<>
                    <button onClick = {register} > Register </button>
                    <button onClick = {login} > Log in </button>
                </>)

            }

            
        </nav>
    )
}
