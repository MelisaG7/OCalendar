import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../apiservice/ApiInlogService";

export const AdminDashboard: React.FC = () => 
{
    const navigate = useNavigate()
    
    const LogOut = async() =>{
        const response = await logout()
        navigate("/")
        return response
    }
    return(
        <div>
        <h3>Hi, Im the admin dashboard</h3>
        <button
        onClick={() => LogOut()}>
            Log out
        </button>
        </div>
    )
}