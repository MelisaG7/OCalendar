import React, { useState, useEffect } from "react";
import { GetFutureEvents, getAttendingEvents, deleteAttendance } from "../apiservice/ApiUserDashboardservice";
import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);  // For upcoming events
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);  // Ensure this is an array

  // Fetch upcoming events
  const ShowFutureEvents = async () => {
    try {
      const response = await GetFutureEvents();
      setEvents(response);
    } catch (error) {
      console.error("Error fetching future events:", error);
    }
  };
  

  // Fetch events the user is attending
  const fetchAttendingEvents = async () => {
    try {
      const response = await getAttendingEvents();  // Fetch attending events from API

      if (Array.isArray(response)) {
        setAttendingEvents(response);  // Ensure it is an array before setting state
      } else {
        console.error("Error: Expected an array of attending events, but got:", response);
      }
    } catch (error) {
      console.error("Error fetching attending events:", error);
    }
  };

  useEffect(() => {
    ShowFutureEvents();
    fetchAttendingEvents();  // Fetch the user's attending events when the component loads
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

  const handleDeleteAttendance = async (eventId: number) => {
    try {
      const response = await deleteAttendance(eventId);  // Remove attendance
      setAttendingEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));  // Update the attending events list
      alert("Attendance removed successfully.");
    } catch (error) {
      console.error("Error removing attendance:", error);
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
              <button onClick={() => handleEventClick(event.eventId)}>View Details</button>
            </li>
          ))}
        </ul>
      )}

      <h4>My upcoming events</h4>
      {attendingEvents.length === 0 ? (
        <p>You are not attending any events.</p>
      ) : (
        <ul>
          {attendingEvents.map((event) => (
            <li key={event.eventId}>
              <strong>{event.title}</strong> - {event.eventDate}
              <button onClick={() => handleDeleteAttendance(event.eventId)}>Remove Attendance</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
