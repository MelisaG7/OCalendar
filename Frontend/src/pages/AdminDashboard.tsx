import React from "react";
import { useNavigate } from "react-router-dom"; // use Navigate wordt gebruikt voor routers en te switchen van pagina's
import { logout } from "../apiservice/ApiInlogService";

export const AdminDashboard: React.FC = () => 
{
    const navigate = useNavigate() // Je moet dan wel een functie maken daarvoor
    
    const LogOut = async() =>{
        const response = await logout() // functie in de apiservice bestand die communcieert met backend
        navigate("/") // Hier ga je terug naar de root page. gewoon /<endpoint> om naar die page te gaan.
        // Namen kan je vinden in de index.ts (voorbeelden zijn /dashboard, /login, etc)
        return response
        // returned een message
    }
    return(
        <div>
        <h3>Hi, Im the admin dashboard</h3>
        <button
        // Als je op de button klikt ga je naar de logout fucntie hierboven
        onClick={() => LogOut()}>
            Log out
        </button>
        </div>
    )
}