import React from "react";
import axios, { AxiosInstance } from "axios";

// Guys als jullie met backend willen communiceren MOET je withCredentials sturen MOETTTT!!!
// Als je dat niet doet krijg je session issues en state wordt niet goed geset, of blijft niet hetzelde
// En dat was gewoon horrible
const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5097", // Backend URL
    withCredentials: true, // Ensures cookies are sent
});

export async function getEvent(eventId: number): Promise<any> {
    // Je hoeft niet persee een axiosInstance te maken. Je kan ook gelijk axios.get doen maar laat ik zien in andere file
    const event = await axiosInstance.get(`/api/v1/Events/events/${eventId}`) //rest van backend url!!
    // Als je returned is het belangrijk om response.DATA!!! te doen, dan krijg je de object
    // Ik wou alleen wat in de key result stond, dus heb ik .result gedaan om derest weg te laten.
    return event.data.result // ok
}

export async function GetEventAttendees(eventId: number): Promise<any[]> {
    try {
        const response = await axiosInstance.get(
            `http://localhost:5097/api/v1/EventsAD/Attendees/${eventId}`
        );
        console.log("API response:", response.data.$values); // Debugging
        return response.data.$values || []; // Retourneer de deelnemers of een lege array
    } catch (error) {
        console.log(eventId)
        console.error("Error fetching event attendees:", error);
        return []; // Retourneer een lege array bij een fout
    }
}