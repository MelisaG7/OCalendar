import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetEventAttendees } from "../apiservice/ApiEventService";

export const ViewAttendees: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [attendees, setAttendees] = useState<any[]>([]); // Gebruik 'any' om alle soorten data te accepteren
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const eventId = location.state;

    useEffect(() => {
        if (!eventId) {
            setError("No event ID provided.");
            setLoading(false);
            return;
        }

        const fetchAttendees = async () => {
            try {
                const data = await GetEventAttendees(eventId);
                console.log("Complete API response:", data); // Debug: Print de complete API-respons
                setAttendees(data); // Zet de respons zoals die is in de state
            } catch (error) {
                setError("Failed to fetch attendees.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendees();
    }, [eventId]);

    if (loading) {
        return <div>Loading attendees...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={() => navigate("/admindashboard")}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h3>Event Attendees</h3>
            {Array.isArray(attendees) && attendees.length === 0 ? (
                <p>No attendees found for this event.</p>
            ) : (
                <ul>
                    {attendees.map((attendee: any, index: number) => (
                        <li key={index} style={{ marginBottom: "10px" }}>
                            {attendee.firstName} {attendee.lastName}
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={() => navigate("/admindashboard")}
                style={{
                    marginTop: "20px",
                    padding: "10px 15px",
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};
