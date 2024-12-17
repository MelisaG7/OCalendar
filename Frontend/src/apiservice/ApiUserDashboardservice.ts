import axios from "axios";
import { Event } from "./ApiRegistrationService";

// Deze moet een lijst returnen met alle future events

export async function GetFutureEvents() : Promise<any[]>
{
    const response = await axios.get("http://localhost:5097/api/v1/Events/FutureEvents")
    console.log(response.data.$values)
    return response.data.$values
}
// Later moet ik iets doen met dat data klikbaar is voor meer details bla bla bla