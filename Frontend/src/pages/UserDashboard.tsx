// Okay als ik ben ingelogd moet ik hierheen komen
import React, { useState, useEffect} from "react";
import { GetFutureEvents } from "../apiservice/ApiUserDashboardservice";
import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";
// import { Event as EventModel} from "../states/RegisterState";

// Ik wil zoeiets doen van Welkom back 'x', met dan de naam van de user
// Maar dat zie ik later wel, eerst ervoor zorgen dat ie in de dashboard komt haha

export const UserDashboard: React.FC = () => 
{
    // Navigatie locatie
    const navigate = useNavigate()
    // state. objects is een array, dat is de state object.
    // setObjects set 'objects' naar array naar keuze. Heel makkelijk als je het snapt
    const [objects, setObjects] = useState<any[]>([]) //Ik heb bijvoorbeeld gezegd tegen useState dat ik een array van 'any' type gebruik

    // Je past een event object als argument
    const ShowEventDetails = (Event: any) =>
    {
        // dan ga je navigeren naar de eventdetailpage en pass je de id als parameter
        navigate(`/eventdetails/${Event.eventId}`)
    }
    const ShowFutureEvents = async () =>
    {
        // Callt de api method die alle future events uit de backend haalt
        const response = await GetFutureEvents()
        // response zijn de future events uit de database, setObjects zet 'objects' (oftewel state) naar response
        // de objects = response (this.state = response ofzo got it?)
        setObjects(response)
    }
    useEffect(() => {
        // Om deze method te callen
        ShowFutureEvents();
      }, []);

    const LogOut = async() =>{
        // roept logout van apiservice om actually uit te loggen
        const response = await logout()
        // gaat terug naar de rootpage
        navigate("/")
        return response
    }
    return(
        <div>
        <h3>Hi, Im the user dashboard</h3>
        <button
        // Als je klikt, log je out basically
        onClick={() => LogOut()}>Log out</button>
      <ul>
        {/* Loopt door 'objects' op basis van eventId (key) en print whatever je wilt */}
        {objects.map((obj) => (
          <li key={obj.eventId}>
            <strong>{obj.title}</strong><button
            // Ik heb ook een button dat als je daarop klikt dus naar de detailpage gaat.
            onClick={() => ShowEventDetails(obj)}>
                Show details
            </button>
          </li>
        ))}
      </ul>
        </div>
    )
}