import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AddNewEvent, UpdateEvent } from "../apiservice/ApiAdminDashboardservice";

export const CreateEditEvent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Map velden met kleine letters naar de gewenste veldnamen met destructurering
    const {
        eventId = null, // Voeg eventId toe voor updates
        title = "",
        description = "",
        eventDate = "",
        startTime = "",
        endTime = "",
        location: eventLocation = "",
        adminApproval = true,
    } = location.state || {};

    // Stel de state in met de gemapte velden
    const [event, setEvent] = React.useState<any>({
        EventId: eventId, // Nodig voor updates
        Title: title,
        Description: description,
        EventDate: eventDate,
        StartTime: startTime,
        EndTime: endTime,
        Location: eventLocation,
        AdminApproval: adminApproval,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setEvent((prevState: any) => ({
            ...prevState, // Houd bestaande velden vast
            [name]: value, // Update alleen het veld dat gewijzigd wordt
        }));
    };

    const handleSubmit = async () => {
        try {
            if (event.EventId) {
                // Update bestaande event
                console.log("Updating event:", event);
                await UpdateEvent(event.EventId, event);
            } else {
                // Maak nieuwe event
                console.log("Creating new event:", event);
                await AddNewEvent(event);
            }
            navigate("/admindashboard"); // Terug naar het dashboard na succes
        } catch (error) {
            console.error("Error submitting event:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h3 style={{ marginBottom: "20px" }}>
                {event.EventId ? "Edit Event" : "Create Event"}
            </h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <label>
                    <span style={{ display: "block", marginBottom: "5px" }}>Title:</span>
                    <input
                        type="text"
                        name="Title"
                        value={event.Title}
                        onChange={handleInputChange}
                        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                    />
                </label>
                <label>
                    <span style={{ display: "block", marginBottom: "5px" }}>Description:</span>
                    <textarea
                        name="Description"
                        value={event.Description}
                        onChange={handleInputChange}
                        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                    />
                </label>
                <label>
                    <span style={{ display: "block", marginBottom: "5px" }}>Event Date:</span>
                    <input
                        type="date"
                        name="EventDate"
                        value={event.EventDate}
                        onChange={handleInputChange}
                        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                    />
                </label>
                <label>
                    <span style={{ display: "block", marginBottom: "5px" }}>Start Time:</span>
                    <input
                        type="time"
                        name="StartTime"
                        value={event.StartTime}
                        onChange={handleInputChange}
                        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                    />
                </label>
                <label>
                    <span style={{ display: "block", marginBottom: "5px" }}>End Time:</span>
                    <input
                        type="time"
                        name="EndTime"
                        value={event.EndTime}
                        onChange={handleInputChange}
                        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                    />
                </label>
                <label>
                    <span style={{ display: "block", marginBottom: "5px" }}>Location:</span>
                    <input
                        type="text"
                        name="Location"
                        value={event.Location}
                        onChange={handleInputChange}
                        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                    />
                </label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {event.EventId ? "Update Event" : "Create Event"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admindashboard")}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "gray",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
