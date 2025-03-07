import { Event } from "./ApiRegistrationService";
import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5097", // Backend URL
    withCredentials: true, // Ensures cookies are sent
});



export async function GetAllEvents(): Promise<any[]> {
    try {
        const response = await axiosInstance.get("http://localhost:5097/api/v1/Events/events");
        console.log("API response:", response.data.result.$values); // Debugging
        return response.data.result.$values || []; // Retourneer de evenementen of een lege array
    } catch (error) {
        console.error("Error fetching events:", error);
        return []; // Retourneer een lege array bij een fout
    }
}

const normalizeTimeFormat = (time: string): string => {
    if (!time.includes(":")) {
        return time; // Ongeldig tijdsformaat, retourneer ongewijzigd
    }
    const parts = time.split(":");
    if (parts.length === 2) {
        // Als het formaat "HH:mm" is, voeg ":00" toe
        return `${time}:00`;
    }
    return time; // Tijd is al in het juiste formaat "HH:mm:ss"
};

export const UpdateEvent = async (id: number, updatedEventData: any): Promise<void> => {
    const EntireEvent: Event = {
        EventId: updatedEventData.EventId,
        Title: updatedEventData.Title,
        Description: updatedEventData.Description,
        EventDate: updatedEventData.EventDate,
        StartTime: normalizeTimeFormat(updatedEventData.StartTime),
        EndTime: normalizeTimeFormat(updatedEventData.EndTime),
        Location: updatedEventData.Location,
        AdminApproval: updatedEventData.AdminApproval,
        Event_Attendances: [],
        AverageRating: updatedEventData.AverageRating
    }
    console.log("Data being sent to server:", EntireEvent);
    try {
        const response = await axiosInstance.put(`http://localhost:5097/api/v1/Events/UpdateEvent/${id}`, EntireEvent, {
            headers: {
                "Content-Type": "application/json"

            },
        });
        console.log("Event updated successfully:", response.data);
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
};

export const DeleteEvent = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete(`http://localhost:5097/api/v1/Events/DeleteEvent/${id}`);
        console.log("Event deleted:", response);
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
};
export async function GetHighestEventId(): Promise<number> {
    try {
        const events = await GetAllEvents(); // Haal alle events op
        console.log("Fetched events:", events); // Debugging

        // Vind de hoogste EventId
        const highestEventId = events.reduce((maxId, event) => {
            return event.eventId > maxId ? event.eventId : maxId;
        }, 0); // Begin met 0 als het standaard max ID

        return highestEventId + 1; // Retourneer de hoogste EventId
    } catch (error) {
        console.error("Error fetching highest EventId:", error);
        return 0; // Retourneer 0 als fallback bij een fout
    }
}

export async function AddNewEvent(payload: any): Promise<any> {

    const highestEventId = await GetHighestEventId();

    const EntireEvent: Event = {
        EventId: highestEventId,
        Title: payload.Title,
        Description: payload.Description,
        EventDate: payload.EventDate,
        StartTime: payload.StartTime + ":00",
        EndTime: payload.EndTime + ":00",
        Location: payload.Location,
        AdminApproval: true,
        Event_Attendances: []
    }
    try {
        const response = await axiosInstance.post("http://localhost:5097/api/v1/Events/CreateEvent", EntireEvent, {
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




