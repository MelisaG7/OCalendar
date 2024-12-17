import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom"
import { getEvent } from "../apiservice/ApiEventService";

export const EventDetailPage: React.FC = () =>
{
    // Navigatie functie om te switchen van bestanden
    const navigate = useNavigate()
    // Als deze functie worst aangeroepen ga je terug naar de dashboard
    const GoBack = () =>
    {
        navigate("/dashboard") 
    }
    // eventId query die ik uit de url/endpoint haal
    const {eventId} = useParams<{eventId: any}>()
    // het wordt als string gestuurd dus ik maak daar een nieuwe number variable van
    const EventID = parseInt(eventId)
    // Dit is de state voor als je geen classes gebruikt maar hooks
    // Hooks *const EventDetailPage* is 1000x makkelijker dan classes dus drm gebruik ik het
    const [event, setEvent] = useState<any>({})
    //!!!!event is de object, basically de state variable en setEvent is de functie die de object veranderd!!!!
    const GetEvent = async () =>
        {
            // GetEvent callt getEvent die de api is die met backend communiceert
            const Event = await getEvent(EventID)
            // We fetchen een Event object en setten die als de state object, wat ik hierboven heb uitgelegd
            setEvent(Event)
        }
    
    // Ermmm useEffect moet je gebruiken om GetEvent op te roepen, not sure why though..
    // Lees dat ff zelf ig
    useEffect(() =>{
        GetEvent()
    }, [EventID])
    return(
        // Dit spreekt voorzich, print gewoon wat in de state zit
        <div>
            <h3>{event.title}</h3>
            <div>Description: {event.description}
            </div>
            <div>
                Date: {event.eventDate}
            </div>
            <div>
                Time: {event.startTime} - {event.endTime}
            </div>
            <div>
                location: {event.location}
            </div>
            {/* Onclick callt de GoBack method, niet heel interressant */}
            <div><button onClick={() => GoBack()}>Back</button></div>
        </div>
    )
}
// "eventDate": "2025-01-18",
// "startTime": "12:00:00",
// "endTime": "14:00:00",
// "location": "Wijnhaven 108",