import React, { useState, useEffect } from "react";
import { GetFutureEvents } from "../apiservice/ApiUserDashboardservice";
import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);

  const ShowFutureEvents = async () => {
    try {
      const response = await GetFutureEvents();
      setEvents(response);
    } catch (error) {
      console.error("Error fetching future events:", error);
    }
  };

  useEffect(() => {
    ShowFutureEvents();
  }, []);

  const handleEventClick = (eventId: number) => {
    navigate(`/eventdetails/${eventId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h3>Welcome to your Dashboard</h3>
      <button onClick={handleLogout}>Log out</button>
      <h4>All Upcoming Events</h4>
      {events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.eventId}>
              <strong>{event.title}</strong> - {event.eventDate}
              <button onClick={() => handleEventClick(event.eventId)}>
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
