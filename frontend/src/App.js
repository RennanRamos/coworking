import React, {useState, useEffect} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Axios from "axios";
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import Meeting from './components/pages/Meeting';
import Workstation from './components/pages/Workstation';
import MeetingAdmin from './components/pages/MeetingAdmin';
import WorkstationAdmin from './components/pages/WorkstationAdmin';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from "./components/auth/ResetPassword";
import PersonalData from "./components/auth/PersonalData";
import UserContext from './context/UserContext';
import NewPassword from './components/auth/NewPassword';

import "./style.css";


export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect (() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post(
                    "http://104.131.46.234:5000/users/tokenIsValid", null, { headers: {"x-auth-token": token} });
            if (tokenRes.data){
                const userRes = await Axios.get(
                    "http://104.131.46.234:5000/users/", { headers: {"x-auth-token": token},});
                
                setUserData({
                    token,
                    user: userRes.data,
                });
            }

        }; 

        checkLoggedIn();
    }, []);

    return <>
    <BrowserRouter>
    <UserContext.Provider value = {{userData, setUserData}}>
    <Header />
        <div className = "container">
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/meeting" component={Meeting} />
            <Route path="/workstation" component={Workstation} />
            <Route path="/meetingAdmin" component={MeetingAdmin} />
            <Route path="/workstationAdmin" component={WorkstationAdmin} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route exact path="/resetPassword" component={ResetPassword} />
            <Route path="/resetPassword/:token" component={NewPassword} />
            <Route path="/personalData" component={PersonalData} />
        </Switch>
        </div>
    </UserContext.Provider>
    </BrowserRouter>
    </>;
}
