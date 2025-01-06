import axios from "axios";
import { Event } from "./ApiRegistrationService";


export async function GetAllEvents(): Promise<any[]> {
    try {
        const response = await axios.get("http://localhost:5097/api/v1/Events/events");
        console.log("API response:", response.data.result.$values); // Debugging
        return response.data.result.$values || []; // Retourneer de evenementen of een lege array
    } catch (error) {
        console.error("Error fetching events:", error);
        return []; // Retourneer een lege array bij een fout
    }
}
export async function GetHighestEventId(): Promise<number> {
    try {
        const events = await GetAllEvents(); // Haal alle events op
        console.log("Fetched events:", events); // Debugging

        // Vind de hoogste EventId
        const highestEventId = events.reduce((maxId, event) => {
            return event.EventId > maxId ? event.EventId : maxId;
        }, 0); // Begin met 0 als het standaard max ID

        return highestEventId + 1; // Retourneer de hoogste EventId
    } catch (error) {
        console.error("Error fetching highest EventId:", error);
        return 0; // Retourneer 0 als fallback bij een fout
    }
}

export async function AddNewEvent(payload: any): Promise<any> {

    const highestEventId = await GetHighestEventId();
    const newEventId = highestEventId + 1;

    const EntireEvent: Event = {
        EventId: 300,
        Title: payload.Title,
        Description: payload.Description,
        EventDate: payload.EventDate,
        StartTime: payload.StartTime + ":00",
        EndTime: payload.EndTime + ":00",
        Location: payload.Location,
        AdminApproval: true,
        Event_Attendances: [],
        AverageRating: 5
    }
    try {
        const response = await axios.post("http://localhost:5097/api/v1/Events/CreateEvent", EntireEvent, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.data
    }
    catch (error: any) {
        return error.response.data
    }
}




