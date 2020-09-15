import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";


export default function Workstation() {
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user) history.push("/login");
    }, [history, userData.user]);

    return <div className = "page"> Workstation </div>;
    
}