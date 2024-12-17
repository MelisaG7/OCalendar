// Okay als ik ben ingelogd moet ik hierheen komen
import React from "react";
import { GetFutureEvents } from "../apiservice/ApiUserDashboardservice";
import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";

// Ik wil zoeiets doen van Welkom back 'x', met dan de naam van de user
// Maar dat zie ik later wel, eerst ervoor zorgen dat ie in de dashboard komt haha

export const UserDashboard: React.FC = () => 
{
    const navigate = useNavigate()

    const ShowFutureEvents = async () =>
    {
        const response = await GetFutureEvents()
        return response
    }

    const LogOut = async() =>{
        const response = await logout()
        navigate("/")
        return response
    }
    return(
        <div>
        <h3>Hi, Im the user dashboard</h3>
        <button
        onClick={() => LogOut()}>Log out</button>
        </div>
    )
}