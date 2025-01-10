import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AttendEventForm } from "./AttendEventForm";
import { getEvent } from "../apiservice/ApiEventService";


export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>(); // Extract eventId from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventDetails = await getEvent(Number(eventId)); // Fetch event details by eventId
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
      <h3>Event name: {event.title}</h3>
      <p>Description: {event.description}</p>
      <p>Date: {event.eventDate}</p>
      <p>Time: {event.startTime} - {event.endTime}</p>
      <p>Location: {event.location}</p>
      {/* Just render AttendEventForm without passing eventId */}
      <AttendEventForm />
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};
