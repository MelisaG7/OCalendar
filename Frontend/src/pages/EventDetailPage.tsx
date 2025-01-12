import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AttendEventForm } from "./AttendEventForm";
import { getEvent } from "../apiservice/ApiEventService";


export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>(); 
  const navigate = useNavigate();
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventDetails = await getEvent(Number(eventId)); 
        setEvent(eventDetails);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]); // Re-fetch if eventId changes

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div>
      <h3 style={{fontFamily: "Arial, sans-serif", }}>Event name: {event.title}</h3>
      <div style={{ 
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
      }}>
        <div style={{ 
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}>
          <p>Description: {event.description}</p>
        </div>
        <div style={{ 
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}>
          <p>Date: {event.eventDate}</p>
        </div>
        <div style={{ 
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}>
          <p>Time: {event.startTime} - {event.endTime}</p>
        </div>
        <div style={{ 
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}>
          <p>Location: {event.location}</p>
        </div>
      </div>
      <AttendEventForm />
      <div style={{ marginTop: "20px" }}> 
      <button onClick={() => navigate("/dashboard")}
           style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            marginRight: "10px",
        }}>Back to Dashboard</button>
      </div>
    </div>
  );
};
