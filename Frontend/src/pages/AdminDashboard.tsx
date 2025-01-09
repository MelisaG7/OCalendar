import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../apiservice/ApiInlogService";
import { GetAllEvents, AddNewEvent, DeleteEvent, UpdateEvent } from "../apiservice/ApiAdminDashboardservice";
import { GetEventAttendees } from "../apiservice/ApiEventService";

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
    const [editingEvent, setEditingEvent] = useState<any | null>(null);

    const fetchEvents = async () => {
        try {
            const response = await GetAllEvents();
            setEvents(response);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const LogOut = async () => {
        await logout();
        navigate("/");
    };

    const handleAddOrUpdateEvent = async () => {
        try {
            if (editingEvent) {
                const updatedEventData = {
                    EventId: editingEvent.eventId,
                    AverageRating: editingEvent.averageRating,
                    ...newEventData,
                };
                await UpdateEvent(editingEvent.eventId, updatedEventData);
            } else {
                await AddNewEvent(newEventData);
            }
            fetchEvents(); // Refresh events
            navigate("/"); // Terug naar de lijst met events
        } catch (error) {
            console.error(editingEvent ? "Error updating event:" : "Error creating event:", error);
        }
    };

    const ViewAttendees = (event: any) => {
        console.log("Event being processed:", event);
        navigate("/view-attendees", { state: event });
    };

    const handleDeleteEvent = async (id: number) => {
        const confirmation = window.confirm("Are you sure you want to delete this event?");
        if (!confirmation) return;

        try {
            await DeleteEvent(id);
            setEvents(events.filter(event => event.eventId !== id));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleEditEvent = (event: any) => {
        console.log("Event being edited:", event);
        setEditingEvent(event);
        setNewEventData({
            Title: event.title,
            Description: event.description,
            EventDate: event.eventDate,
            StartTime: event.startTime,
            EndTime: event.endTime,
            Location: event.location,
            AdminApproval: event.adminApproval,
        });
        navigate("/edit-event", { state: event });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEventData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3 style={{ color: "#333" }}>Welcome to the admin dashboard</h3>
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={LogOut}
                    style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                >
                    Log out
                </button>
                <button
                    onClick={() => navigate("/create-event")}
                    style={{
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        cursor: "pointer",
                    }}
                >
                    Create Event
                </button>
            </div>
            <h4 style={{ color: "#555" }}>Upcoming Events</h4>
            <ul style={{ padding: "0", listStyle: "none" }}>
                {events.map(event => (
                    <li
                        key={event.eventId}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <span style={{ flex: 1 }}>
                            <div> {event.title} </div>
                            {event.eventDate}
                        </span>
                        <button
                            onClick={() => handleEditEvent(event)}
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                                marginRight: "10px",
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteEvent(event.eventId)}
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                                marginRight: "10px",
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => ViewAttendees(event.eventId)}
                            style={{
                                backgroundColor: "purple",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            View Attendees
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
};
