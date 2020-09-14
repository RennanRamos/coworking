import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";

export default function PersonalData() {
    const [userName, setUserId] = useState();
    const [userBirth, setUserBirth] = useState();
    const [userCPF, setUserCPF] = useState();
    const [userAddress, setUserAddress] = useState();
    const [userBiography, setUserBiography] = useState();
    const [email, setEmail] = useState();
    const [resetTokenConfirmation, setResetTokenConfirmation] = useState();

    const [error, setError] = useState();

    const { userData } = useContext(UserContext);
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user) history.push("/login");
    }, [history, userData.user]);
    
    function SendNewToken() {
        Axios.post( "http://localhost:5000/users/newToken", {id:userData.user.id});
    }

    const submitToken = async (e) => {
        e.preventDefault();      
        try{
            await Axios.post( "http://localhost:5000/users/confirmationToken", {token:resetTokenConfirmation, id:userData.user.id, });
            setUserData({
                accountKeyConfirmed: true,
            });

        }catch(err){
        }
    };

    const submitNewEmail = async (e) => {
        e.preventDefault();      
        try{
            await Axios.post("http://localhost:5000/users/emailChange", { newEmail:email, id:userData.user.id });
            history.push("/login");
        }catch(err){
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        
        try{
            const dataUser = { userName, userBirth, userCPF, userAddress, userBiography, id:userData.user.id };
            await Axios.post( "http://localhost:5000/users/personalData", dataUser);

            history.push("/");
        }catch(err){
        }
    };
    

    return (
        <div className = "page">
            <h2>Insert Your Data</h2>
            {error && (
                <ErrorNotice message = {error} clearError = {() => setError(undefined)}/>
            )}
            <form className = "form" onSubmit = {submit}>
                <label htmlFor = "user-name">User Name*</label>
                <input 
                    id = "user-name"
                    type = "userName"
                    onChange = {(e) => setUserId(e.target.value)}
                />

                <label htmlFor = "user-birth">Birth Date*</label>
                <input 
                    id = "user-birth"
                    type = "userBirth"
                    onChange = {(e) => setUserBirth(e.target.value)}
                />

                <label htmlFor = "user-CPF">CPF*</label>
                <input 
                    id = "user-CPF"
                    type = "userCPF"
                    onChange = {(e) => setUserCPF(e.target.value)}
                />

                <label htmlFor = "user-address">Address*</label>
                <input 
                    id = "user-address"
                    type = "userAddress"
                    onChange = {(e) => setUserAddress(e.target.value)}
                />

                <label htmlFor = "Biography">Biography</label>
                <input 
                    id = "Biography"
                    type = "userBiography"
                    onChange = {(e) => setUserBiography(e.target.value)}
                />
                <input type = "submit" value = "Update Data" />
            </form>


            <form className = "form" onSubmit = {submitNewEmail}>
                <label htmlFor = "email">Change Email</label>
                <input 
                    id = "email"
                    type = "newEmail"
                    onChange = {(e) => setEmail(e.target.value)}
                />

                <button type = "submitNewEmail"> Change Email </button >
            </form>


            <form className = "form" onSubmit = {submitToken}>

                <label htmlFor = "token">Confirmation Token*</label>
                <input 
                    id = "token"
                    type = "resetTokenConfirmation"
                    onChange = {(e) => setResetTokenConfirmation(e.target.value)}
                />

                <button type = "submitToken"> Confirm Token </button >
                <>    </>
                <button onClick = {SendNewToken}> Send a new Token </button >
            </form>


        </div>
    )
}