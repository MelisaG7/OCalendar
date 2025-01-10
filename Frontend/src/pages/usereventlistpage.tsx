import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllEvents } from "../apiservice/ApiAdminDashboardservice";

export const UserEventListPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await GetAllEvents(); // API call om events te halen
      console.log("Fetched events:", fetchedEvents);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setMessage("Failed to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h3>Available Events</h3>
      {message && <div style={{ marginBottom: "10px" }}>{message}</div>}
      <ul style={{ listStyle: "none", padding: "0" }}>
        {events.map((event) => (
          <li
            key={event.eventId}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h4>{event.title}</h4>
            <p>{event.description}</p>
            <p>Date: {event.eventDate}</p>
            <p>
              Time: {event.startTime} - {event.endTime}
            </p>
            <p>Location: {event.location}</p>
            <button
              onClick={() => navigate(`/eventattendance/${event.eventId}`)}
              style={{
                padding: "8px 12px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Attend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
