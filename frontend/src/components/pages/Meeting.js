import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import Axios from "axios";


export default function Meeting() {
    const { userData } = useContext(UserContext);
    const history = useHistory();
    const [error, setError] = useState();

    useEffect(() => {
        if (!userData.user) history.push("/login");
    }, [history, userData.user]);


    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [meetingRoom, setUserMeetingRoom] = useState();
    const [hour, setUserHour] = useState();
    const [criator, setCreator] = useState();
    const [participants, setParticipants] = useState();


    const submit = async (e) => {
        e.preventDefault();
        
        try{
            const dataUser = { name, description, meetingRoom, hour, criator, participants,id:userData.user.id };
            await Axios.post( "http://localhost:5000/users/", dataUser);
            history.push("/");
        }catch(err){
        }
    };
    

    return (
        <div className = "page">
            <h2>Meeting</h2>
            {error && (
                <ErrorNotice message = {error} clearError = {() => setError(undefined)}/>
            )}
            <form className = "form" onSubmit = {submit}>
                <label htmlFor = "name">Name</label>
                <input 
                    id = "name"
                    type = "text"
                    onChange = {(e) => setName(e.target.value)}
                />

                <label htmlFor = "description">Description</label>
                <input 
                    id = "description"
                    type = "text"
                    onChange = {(e) => setDescription(e.target.value)}
                />

                <label htmlFor = "meetingRoom">MeetingRoom</label>
                <input 
                    id = "meetingRoom"
                    type = "text"
                    onChange = {(e) => setUserMeetingRoom(e.target.value)}
                />

                <label htmlFor = "hour">Hour</label>
                <input 
                    id = "hour"
                    type = "text"
                    onChange = {(e) => setUserHour(e.target.value)}
                />

                <label htmlFor = "criator">Criator</label>
                <input 
                    id = "criator"
                    type = "text"
                    onChange = {(e) => setCreator(e.target.value)}
                />

                <label htmlFor = "participants">Participants</label>
                <input 
                    id = "participants"
                    type = "text"
                    onChange = {(e) => setParticipants(e.target.value)}
                />

                <input type = "submit" value = "Create Meeting" />
            </form>

        </div>
    )

}