import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../apiservice/ApiInlogService";
import { GetAllEvents } from "../apiservice/ApiAdminDashboardservice";
import { AddNewEvent } from "../apiservice/ApiAdminDashboardservice"; // Importeer de functie

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const [events, setEvents] = useState<any[]>([]);
    const [newEventData, setNewEventData] = useState({
        Title: "",
        Description: "",
        EventDate: "",
        StartTime: "",
        EndTime: "",
        Location: "",
        AdminApproval: true,
    });

    const fetchFutureEvents = async () => {
        try {
            const response = await GetAllEvents();
            setEvents(response);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchFutureEvents();
    }, []);

    const LogOut = async () => {
        await logout();
        navigate("/");
    };

    const handleAddEvent = async () => {
        try {
            const response = await AddNewEvent(newEventData);
            console.log("New event created:", response);
            setEvents(prevEvents => [...prevEvents, response]);  // Voeg het nieuwe evenement toe
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEventData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div>
            <h3>Hi, I'm the admin dashboard</h3>
            <button onClick={LogOut}>Log out</button>

            <h4>Upcoming Events</h4>
            <ul>
                {events.map((event) => (
                    <li key={event.eventId}>
                        <strong>{event.title}</strong> - {event.date} {/* Voeg meer details toe als nodig */}
                    </li>
                ))}
            </ul>

            <h4>Create New Event</h4>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    name="Title"
                    value={newEventData.Title}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    name="Description"
                    value={newEventData.Description}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Event Date:</label>
                <input
                    type="date"
                    name="EventDate"
                    value={newEventData.EventDate}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Start Time:</label>
                <input
                    type="time"
                    name="StartTime"
                    value={newEventData.StartTime}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>End Time:</label>
                <input
                    type="time"
                    name="EndTime"
                    value={newEventData.EndTime}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    name="Location"
                    value={newEventData.Location}
                    onChange={handleInputChange}
                />
            </div>

            <button
                onClick={handleAddEvent}>Create New Event</button>
        </div>
    );
};
